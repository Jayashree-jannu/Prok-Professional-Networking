from flask import Blueprint
from app.backend.extensions import db
from app.backend.models.message import Message

messaging_bp = Blueprint('messaging', __name__)
 
# Routes will be implemented here 