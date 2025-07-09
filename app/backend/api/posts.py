from flask import Blueprint, request, jsonify, current_app, send_from_directory
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.backend.extensions import db
from app.backend.models.post import Post
from app.backend.models.user import User
import os
from werkzeug.utils import secure_filename
from datetime import datetime

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'mp4', 'mov', 'avi'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

posts_bp = Blueprint('posts', __name__)

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), '..', 'post_media')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

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
    return jsonify({
        'id': post.id,
        'user_id': post.user_id,
        'content': post.content,
        'media_url': post.media_url,
        'created_at': post.created_at.isoformat()
    }), 201

@posts_bp.route('/api/posts', methods=['GET'])
def list_posts():
    posts = Post.query.order_by(Post.created_at.desc()).all()
    return jsonify([
        {
            'id': p.id,
            'user_id': p.user_id,
            'content': p.content,
            'media_url': p.media_url,
            'created_at': p.created_at.isoformat()
        } for p in posts
    ])

# Serve media files
def register_media_route(app):
    @app.route('/post_media/<filename>')
    def serve_post_media(filename):
        folder = os.path.join(os.path.dirname(__file__), '..', 'post_media')
        return send_from_directory(folder, filename)

# Routes will be implemented here 