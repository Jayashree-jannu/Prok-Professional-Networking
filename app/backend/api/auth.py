from flask import Blueprint, request, jsonify
from app.backend.extensions import db, jwt, limiter
from app.backend.models.user import User
from flask_jwt_extended import create_access_token
from passlib.hash import bcrypt
import re
from sqlalchemy.exc import IntegrityError

auth_bp = Blueprint('auth', __name__)

# Password complexity regex: min 8 chars, 1 upper, 1 lower, 1 digit, 1 special
PASSWORD_REGEX = re.compile(r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$')

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = str(data.get('username', '')).strip()
    email = str(data.get('email', '')).strip().lower()
    password = str(data.get('password', ''))

    # Input validation
    if not username or not email or not password:
        return jsonify({'msg': 'Missing required fields'}), 400
    if not PASSWORD_REGEX.match(password):
        return jsonify({'msg': 'Password must be at least 8 chars, include upper, lower, digit, special char'}), 400
    if not re.match(r'^\S+@\S+\.\S+$', email):
        return jsonify({'msg': 'Invalid email format'}), 400

    # Hash password
    password_hash = bcrypt.hash(password)
    user = User(username=username, email=email, password_hash=password_hash)
    try:
        db.session.add(user)
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({'msg': 'Username or email already exists'}), 400
    return jsonify({'msg': 'User created'}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    identifier = str(data.get('username', '') or data.get('email', '')).strip().lower()
    password = str(data.get('password', ''))
    print('Login attempt:')
    print('  Received data:', data)
    print('  Identifier:', identifier)
    user = User.query.filter((User.username==identifier)|(User.email==identifier)).first()
    print('  User found:', user is not None)
    if user:
        print('  User.username:', user.username)
        print('  User.email:', user.email)
        print('  Password hash:', user.password_hash)
        try:
            password_check = bcrypt.verify(password, user.password_hash)
        except Exception as e:
            print('  Password check error:', e)
            password_check = False
        print('  Password check:', password_check)
    else:
        password_check = False
    if not user or not password_check:
        print('  Login failed: Invalid username/email or password')
        return jsonify({'msg': 'Invalid username/email or password'}), 401
    access_token = create_access_token(identity=str(user.id))
    print('  Login successful!')
    return jsonify({'access_token': access_token, 'user': {'id': user.id, 'username': user.username, 'email': user.email}}), 200

# Routes will be implemented here 