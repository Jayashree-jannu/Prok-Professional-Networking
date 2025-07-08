import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from .config import Config
from .extensions import db, migrate, jwt, limiter
from .api import register_blueprints
from flask_jwt_extended import get_jwt_identity, jwt_required

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    limiter.init_app(app)
    # Allow CORS for all local frontend ports (5173, 5174, 5175) and wildcard for dev
    CORS(app, supports_credentials=True, origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:5175"
    ])

    # Register blueprints
    register_blueprints(app)

    # Health check root route
    @app.route('/')
    def index():
        return 'Backend is running', 200

    # Import User model inside app context for migration
    with app.app_context():
        from .models.user import User
        db.create_all()

    # Serve profile images from the root URL
    @app.route('/profile_images/<filename>')
    def serve_profile_image(filename):
        upload_folder = os.path.join(os.path.dirname(__file__), 'profile_images')
        return send_from_directory(upload_folder, filename)

    return app

def get_app():
    """For CLI/legacy usage: returns the app instance."""
    return create_app() 