from app.backend.extensions import db
from datetime import datetime

class Job(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(128), nullable=False)
    description = db.Column(db.Text, nullable=False)
    company = db.Column(db.String(128), nullable=False)
    location = db.Column(db.String(128))
    posted_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Job {self.id} - {self.title}>'
