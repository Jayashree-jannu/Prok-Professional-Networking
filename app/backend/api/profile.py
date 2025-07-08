from flask import Blueprint, request, jsonify, current_app, send_from_directory
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models.user import User
from ..extensions import db
import os
from werkzeug.utils import secure_filename
from PIL import Image
import time

profile_bp = Blueprint('profile', __name__)

UPLOAD_FOLDER = os.path.join(os.getcwd(), 'profile_images')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def user_to_dict(user):
    return {
        'username': user.username,
        'email': user.email,
        'bio': user.bio,
        'skills': user.skills,
        'title': user.title,
        'location': user.location,
        'social': user.social,
        'education': user.education,
        'avatar': user.avatar,
    }

@profile_bp.route('/api/profile', methods=['GET', 'PUT'])
@jwt_required()
def profile():
    user = User.query.get(get_jwt_identity())
    if request.method == 'GET':
        return jsonify(user_to_dict(user)), 200
    data = request.get_json()
    # Simple validation
    if 'email' in data and '@' not in data['email']:
        return jsonify({'error': 'Invalid email'}), 400
    if 'username' in data:
        # Check for uniqueness
        if User.query.filter_by(username=data['username']).first() and data['username'] != user.username:
            return jsonify({'error': 'Username already taken'}), 400
        user.username = data['username']
    if 'email' in data:
        # Check for uniqueness
        if User.query.filter_by(email=data['email']).first() and data['email'] != user.email:
            return jsonify({'error': 'Email already taken'}), 400
        user.email = data['email']
    for field in ['bio', 'skills', 'title', 'location', 'social', 'education']:
        if field in data:
            setattr(user, field, data[field])
    db.session.commit()
    return jsonify(user_to_dict(user)), 200

@profile_bp.route('/api/profile/image', methods=['POST'])
@jwt_required()
def upload_profile_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if not allowed_file(file.filename):
        return jsonify({'error': 'Invalid file type'}), 400
    file.seek(0, os.SEEK_END)
    if file.tell() > MAX_FILE_SIZE:
        return jsonify({'error': 'File too large'}), 400
    file.seek(0)
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    ext = file.filename.rsplit('.', 1)[1].lower()
    filename = secure_filename(f"{get_jwt_identity()}_{int(time.time())}.{ext}")
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    # Image processing: resize, compress, convert
    image = Image.open(file)
    image = image.convert('RGB')
    image.thumbnail((400, 400))
    image.save(filepath, format='JPEG', quality=85)
    user = User.query.get(get_jwt_identity())
    user.avatar = f"/profile_images/{filename}"
    db.session.commit()
    return jsonify({'avatar': user.avatar}), 200

# Serve images
@profile_bp.route('/profile_images/<filename>')
def serve_profile_image(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

# Routes will be implemented here 