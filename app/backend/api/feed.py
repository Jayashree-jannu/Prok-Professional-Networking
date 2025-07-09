from flask import Blueprint
from app.backend.extensions import db
from app.backend.models.post import Post

feed_bp = Blueprint('feed', __name__)
 
# Routes will be implemented here 