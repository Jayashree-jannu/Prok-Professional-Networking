from .auth import auth_bp
from .profile import profile_bp
from .posts import posts_bp
from .feed import feed_bp
from .jobs import jobs_bp
from .messaging import messaging_bp

def register_blueprints(app):
    app.register_blueprint(auth_bp)
    app.register_blueprint(profile_bp)
    app.register_blueprint(posts_bp)
    app.register_blueprint(feed_bp)
    app.register_blueprint(jobs_bp)
    app.register_blueprint(messaging_bp)

__all__ = [
    'auth_bp',
    'profile_bp',
    'posts_bp',
    'feed_bp',
    'jobs_bp',
    'messaging_bp',
    'register_blueprints',
] 