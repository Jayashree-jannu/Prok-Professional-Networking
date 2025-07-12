from flask import Blueprint, request, jsonify
from extensions import db
from models.message import Message

messaging_bp = Blueprint('messaging', __name__)
 
# Routes will be implemented here 