import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from config import Config
from extensions import db, migrate, jwt, limiter
from api import register_blueprints
from flask_jwt_extended import get_jwt_identity, jwt_required

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Debug: print JWT config
    print('DEBUG: JWT_SECRET_KEY:', app.config.get('JWT_SECRET_KEY'))
    print('DEBUG: JWT_ACCESS_TOKEN_EXPIRES:', app.config.get('JWT_ACCESS_TOKEN_EXPIRES'))

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    limiter.init_app(app)
    # CORS configuration
    ALLOWED_ORIGINS = os.getenv('ALLOWED_ORIGINS', 'http://localhost:5173,http://localhost:5174,http://localhost:5175,http://127.0.0.1:5173,http://127.0.0.1:5174,http://127.0.0.1:5175,https://your-frontend-url.onrender.com').split(',')
    
    CORS(app,
         origins=ALLOWED_ORIGINS,
         methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
         allow_headers=['Content-Type', 'Authorization', 'X-Requested-With'],
         supports_credentials=True,
         max_age=3600)

    # Register blueprints
    register_blueprints(app)

    # JWT error handler for debugging
    @app.errorhandler(Exception)
    def handle_exception(e):
        import traceback
        print('DEBUG: Global Exception:', e)
        traceback.print_exc()
        return jsonify({'error': str(e), 'type': type(e).__name__}), 500

    # JWT-specific error handlers
    from flask_jwt_extended.exceptions import NoAuthorizationError, InvalidHeaderError, WrongTokenError, RevokedTokenError, FreshTokenRequired, CSRFError, UserLookupError, UserClaimsVerificationError
    from flask_jwt_extended import JWTManager
    @app.errorhandler(NoAuthorizationError)
    @app.errorhandler(InvalidHeaderError)
    @app.errorhandler(WrongTokenError)
    @app.errorhandler(RevokedTokenError)
    @app.errorhandler(FreshTokenRequired)
    @app.errorhandler(CSRFError)
    @app.errorhandler(UserLookupError)
    @app.errorhandler(UserClaimsVerificationError)
    def handle_jwt_errors(e):
        print('DEBUG: JWT Error:', e)
        return jsonify({'error': str(e), 'type': type(e).__name__}), 401

    # Health check root route
    @app.route('/')
    def index():
        return 'Backend is running', 200
    
    # Test endpoint for deployment verification
    @app.route('/api/test')
    def test_api():
        return jsonify({
            'message': 'Backend API is working!',
            'status': 'success',
            'timestamp': '2024-01-01T00:00:00Z'
        }), 200

    # Import User model inside app context for migration
    with app.app_context():
        from models.user import User
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