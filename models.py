from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import qrcode
from io import BytesIO
import base64

db = SQLAlchemy()

class Resident(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    flat = db.Column(db.String(20), nullable=False)
    phone = db.Column(db.String(15), nullable=False)

class Visitor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    resident_id = db.Column(db.Integer, db.ForeignKey('resident.id'), nullable=False)
    visitor_type = db.Column(db.String(20), nullable=False)  # guest, delivery, cab
    phone = db.Column(db.String(15))
    vehicle_no = db.Column(db.String(20))
    status = db.Column(db.String(20), default='pending')  # pending, approved, checked_in, checked_out
    qr_code = db.Column(db.Text)
    arrival_time = db.Column(db.DateTime)
    resident = db.relationship('Resident', backref='visitors')

class Staff(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    type = db.Column(db.String(20), nullable=False)  # maid, cook, driver
    resident_id = db.Column(db.Integer, db.ForeignKey('resident.id'), nullable=False)
    entry_time = db.Column(db.DateTime)
    exit_time = db.Column(db.DateTime)
    resident = db.relationship('Resident', backref='staff')

class PatrolCheckpoint(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(200))
    qr_code = db.Column(db.Text)

class PatrolLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    guard_id = db.Column(db.Integer, nullable=False)
    checkpoint_id = db.Column(db.Integer, db.ForeignKey('patrol_checkpoint.id'))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    gps_location = db.Column(db.Text)
    checkpoint = db.relationship('PatrolCheckpoint')

class SmartDevice(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    type = db.Column(db.String(20), nullable=False)  # lock, barrier
    status = db.Column(db.String(20), default='closed')
    location = db.Column(db.String(100))

def generate_qr_code(data):
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(data)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    buffer = BytesIO()
    img.save(buffer, format='PNG')
    img_str = base64.b64encode(buffer.getvalue()).decode()
    return f"data:image/png;base64,{img_str}"