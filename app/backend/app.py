import os
from flask import Flask
from flask_cors import CORS
from app.backend.config import Config
from app.backend.extensions import db, migrate, jwt, limiter
from app.backend.api import register_blueprints

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    limiter.init_app(app)
    CORS(app, supports_credentials=True)

    # Register blueprints
    register_blueprints(app)

    # Import User model inside app context for migration
    with app.app_context():
        from app.backend.models.user import User

    return app

def get_app():
    """For CLI/legacy usage: returns the app instance."""
    return create_app() 