from extensions import db
from datetime import datetime

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    media_url = db.Column(db.String(256))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    category = db.Column(db.String(64))
    visibility = db.Column(db.String(32), default='public')
    tags = db.Column(db.JSON)
    likes_count = db.Column(db.Integer, default=0)
    views_count = db.Column(db.Integer, default=0)

    def __repr__(self):
        return f'<Post {self.id} by user {self.user_id}>'
