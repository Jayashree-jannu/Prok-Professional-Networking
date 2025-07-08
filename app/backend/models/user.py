from ..extensions import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    bio = db.Column(db.Text)
    skills = db.Column(db.String(256))
    avatar = db.Column(db.String(256))
    social = db.Column(db.JSON)
    title = db.Column(db.String(128))
    location = db.Column(db.String(128))
    education = db.Column(db.JSON)
