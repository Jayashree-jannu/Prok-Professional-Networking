from flask import Blueprint, request, jsonify, current_app, send_from_directory
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models.post import Post
from models.user import User
import os
from werkzeug.utils import secure_filename
from datetime import datetime
from collections import Counter
import time

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'mp4', 'mov', 'avi'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

posts_bp = Blueprint('posts', __name__)

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), '..', 'post_media')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# In-memory cache for categories and tags
_categories_cache = {'data': None, 'timestamp': 0}
_tags_cache = {'data': None, 'timestamp': 0}
CACHE_TIMEOUT = 300  # 5 minutes

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@posts_bp.route('/api/posts', methods=['POST'])
@jwt_required()
def create_post():
    print('DEBUG: ALL HEADERS:', dict(request.headers))
    print('DEBUG: RAW AUTH HEADER:', request.headers.get('Authorization'))
    print('DEBUG: FORM:', request.form)
    print('DEBUG: FILES:', request.files)
    try:
        user_id = get_jwt_identity()
        print('DEBUG: JWT identity:', user_id)
    except Exception as e:
        print('DEBUG: JWT error:', e)
        return jsonify({'error': 'Invalid token', 'details': str(e)}), 401
    content = request.form.get('content', '').strip()
    if not content:
        return jsonify({'error': 'Content is required'}), 400
    media_url = None
    file = request.files.get('media')
    if file:
        if not allowed_file(file.filename):
            return jsonify({'error': 'Invalid file type'}), 422
        file.seek(0, os.SEEK_END)
        file_length = file.tell()
        file.seek(0)
        if file_length > MAX_FILE_SIZE:
            return jsonify({'error': 'File too large'}), 422
        filename = f"{user_id}_{int(datetime.utcnow().timestamp())}_{secure_filename(file.filename)}"
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)
        media_url = f"/post_media/{filename}"
    post = Post(user_id=user_id, content=content, media_url=media_url)
    db.session.add(post)
    db.session.commit()
    # Invalidate categories and tags cache
    _categories_cache['data'] = None
    _tags_cache['data'] = None
    return jsonify({
        'id': post.id,
        'user_id': post.user_id,
        'content': post.content,
        'media_url': post.media_url,
        'created_at': post.created_at.isoformat()
    }), 201

@posts_bp.route('/api/posts', methods=['GET'])
def list_posts():
    # Query params
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 10))
    sort = request.args.get('sort', 'created_at')
    order = request.args.get('order', 'desc')
    category = request.args.get('category')
    visibility = request.args.get('visibility')
    search = request.args.get('search')
    tags = request.args.getlist('tags')

    query = Post.query

    if category:
        query = query.filter(Post.category == category)
    if visibility:
        query = query.filter(Post.visibility == visibility)
    if search:
        query = query.filter(Post.content.ilike(f'%{search}%'))
    if tags:
        for tag in tags:
            query = query.filter(Post.tags.contains([tag]))

    # Sorting
    sort_field = getattr(Post, sort, Post.created_at)
    if order == 'asc':
        query = query.order_by(sort_field.asc())
    else:
        query = query.order_by(sort_field.desc())

    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    posts = pagination.items
    return jsonify({
        'posts': [
        {
            'id': p.id,
            'user_id': p.user_id,
            'content': p.content,
            'media_url': p.media_url,
                'created_at': p.created_at.isoformat() if p.created_at else None,
                'category': p.category,
                'visibility': p.visibility,
                'tags': p.tags,
                'likes_count': p.likes_count,
                'views_count': p.views_count,
        } for p in posts
        ],
        'total': pagination.total,
        'page': pagination.page,
        'per_page': pagination.per_page,
        'pages': pagination.pages
    })

@posts_bp.route('/api/posts/categories', methods=['GET'])
def get_categories():
    now = time.time()
    if _categories_cache['data'] is not None and now - _categories_cache['timestamp'] < CACHE_TIMEOUT:
        return jsonify({'categories': _categories_cache['data']})
    categories = db.session.query(Post.category).distinct().all()
    categories = [c[0] for c in categories if c[0]]
    _categories_cache['data'] = categories
    _categories_cache['timestamp'] = now
    return jsonify({'categories': categories})

@posts_bp.route('/api/posts/popular-tags', methods=['GET'])
def get_popular_tags():
    now = time.time()
    if _tags_cache['data'] is not None and now - _tags_cache['timestamp'] < CACHE_TIMEOUT:
        return jsonify({'tags': _tags_cache['data']})
    all_tags = db.session.query(Post.tags).all()
    tag_counter = Counter()
    for tags in all_tags:
        if tags[0]:
            tag_counter.update(tags[0])
    popular_tags = [tag for tag, _ in tag_counter.most_common(20)]
    _tags_cache['data'] = popular_tags
    _tags_cache['timestamp'] = now
    return jsonify({'tags': popular_tags})

# Serve media files
def register_media_route(app):
    @app.route('/post_media/<filename>')
    def serve_post_media(filename):
        folder = os.path.join(os.path.dirname(__file__), '..', 'post_media')
        return send_from_directory(folder, filename)

# Routes will be implemented here 