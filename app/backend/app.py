import os
from flask import Flask
from flask_cors import CORS, cross_origin
from .config import Config
from .extensions import db, migrate, jwt, limiter
from .api import register_blueprints

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    limiter.init_app(app)
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

    # Register blueprints
    register_blueprints(app)

    # Health check root route
    @app.route('/')
    def index():
        return 'Backend is running', 200

    # Import User model inside app context for migration
    with app.app_context():
        from .models.user import User

    return app

def get_app():
    """For CLI/legacy usage: returns the app instance."""
    return create_app() 