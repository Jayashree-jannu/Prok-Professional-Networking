from flask import Blueprint, request, jsonify
from extensions import db
from models.job import Job

jobs_bp = Blueprint('jobs', __name__)
 
# Routes will be implemented here 