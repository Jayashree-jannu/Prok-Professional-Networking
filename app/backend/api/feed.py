from flask import Blueprint, request, jsonify
from extensions import db
from models.post import Post

feed_bp = Blueprint('feed', __name__)
 
# Routes will be implemented here 