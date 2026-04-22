from flask import Flask, render_template, request, redirect, url_for, flash, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import qrcode
from io import BytesIO
import base64
import json

app = Flask(__name__)
app.config['SECRET_KEY'] = 'mygate2024_secret!'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///mygate.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# === MODELS ===
class Resident(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    flat = db.Column(db.String(20), nullable=False)
    phone = db.Column(db.String(15), nullable=False)

class Visitor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    resident_id = db.Column(db.Integer, db.ForeignKey('resident.id'), nullable=False)
    visitor_type = db.Column(db.String(20), nullable=False)
    phone = db.Column(db.String(15))
    vehicle_no = db.Column(db.String(20))
    status = db.Column(db.String(20), default='pending')
    qr_code = db.Column(db.Text)
    arrival_time = db.Column(db.DateTime)

class Staff(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    type = db.Column(db.String(20), nullable=False)
    resident_id = db.Column(db.Integer, db.ForeignKey('resident.id'), nullable=False)
    entry_time = db.Column(db.DateTime)
    exit_time = db.Column(db.DateTime)

class PatrolCheckpoint(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(200))

class PatrolLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    guard_id = db.Column(db.Integer, nullable=False)
    checkpoint_id = db.Column(db.Integer, db.ForeignKey('patrol_checkpoint.id'))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    gps_location = db.Column(db.Text)

class SmartDevice(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    type = db.Column(db.String(20), nullable=False)
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

# === INIT DATABASE ===
with app.app_context():
    db.create_all()
    
    if Resident.query.count() == 0:
        residents = [
            Resident(name='Admin User', flat='A-101', phone='9876543210'),
            Resident(name='John Doe', flat='A-102', phone='9876543211'),
            Resident(name='Priya', flat='B-201', phone='9876543212'),
        ]
        for r in residents: db.session.add(r)
        
        checkpoints = [
            PatrolCheckpoint(name='Main Gate', location='Entrance'),
            PatrolCheckpoint(name='Tower A', location='Block A'),
            PatrolCheckpoint(name='Parking', location='Basement'),
        ]
        for cp in checkpoints: db.session.add(cp)
        
        devices = [
            SmartDevice(name='Main Gate Lock', type='lock', location='Entrance'),
            SmartDevice(name='Boom Barrier', type='barrier', location='Main Gate'),
        ]
        for d in devices: db.session.add(d)
        
        db.session.commit()
        print("✅ Database seeded with demo data!")

# === ROUTES ===
@app.route('/', methods=['GET', 'POST'])
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        flat = request.form.get('flat', '').strip().upper()
        resident = Resident.query.filter_by(flat=flat).first()
        if resident:
            session['resident_id'] = resident.id
            session['resident_name'] = resident.name
            session['flat'] = resident.flat
            return redirect(url_for('dashboard', resident_id=resident.id))
        flash(f'Flat {flat} not found! Try: A-101, A-102, B-201', 'error')
    return render_template('login.html')

@app.route('/dashboard/<int:resident_id>')
def dashboard(resident_id):
    resident = Resident.query.get_or_404(resident_id)
    pending = Visitor.query.filter_by(resident_id=resident_id, status='pending').count()
    staff_today = db.session.query(Staff).filter(
        Staff.resident_id == resident_id,
        Staff.entry_time >= datetime.now().replace(hour=0, minute=0, second=0)
    ).count()
    return render_template('dashboard.html', resident=resident, pending_visitors=pending, today_staff=staff_today)

@app.route('/visitors/<int:resident_id>', methods=['GET', 'POST'])
def visitors(resident_id):
    resident = Resident.query.get_or_404(resident_id)
    if request.method == 'POST':
        visitor = Visitor(
            name=request.form['name'],
            resident_id=resident_id,
            visitor_type=request.form['type'],
            phone=request.form.get('phone'),
            vehicle_no=request.form.get('vehicle_no'),
            status='approved',
            qr_code=generate_qr_code(f"V:{request.form['name']}:{flat}:{request.form['type']}")
        )
        db.session.add(visitor)
        db.session.commit()
        flash('✅ Visitor approved successfully!')
    visitors_list = Visitor.query.filter_by(resident_id=resident_id).order_by(Visitor.id.desc()).limit(10).all()
    return render_template('visitor.html', resident=resident, visitors=visitors_list)

@app.route('/staff/<int:resident_id>', methods=['GET', 'POST'])
def staff(resident_id):
    resident = Resident.query.get_or_404(resident_id)
    if request.method == 'POST':
        staff_member = Staff(
            name=request.form['name'],
            type=request.form['type'],
            resident_id=resident_id,
            entry_time=datetime.now()
        )
        db.session.add(staff_member)
        db.session.commit()
        flash('✅ Staff entry recorded!')
    
    staff_list = Staff.query.filter_by(resident_id=resident_id).order_by(Staff.entry_time.desc()).limit(20).all()
    return render_template('staff.html', resident=resident, staff_members=staff_list)

@app.route('/staff/<int:resident_id>/exit/<int:staff_id>', methods=['POST'])
def staff_exit(resident_id, staff_id):
    staff = Staff.query.get_or_404(staff_id)
    if staff.resident_id == resident_id and not staff.exit_time:
        staff.exit_time = datetime.now()
        db.session.commit()
        return jsonify({'success': True})
    return jsonify({'success': False})

@app.route('/patrol')
def patrol():
    checkpoints = PatrolCheckpoint.query.all()
    return render_template('patrol.html', checkpoints=checkpoints)

@app.route('/patrol_log', methods=['POST'])
def patrol_log():
    if request.method == 'POST':
        log = PatrolLog(
            guard_id=int(request.form['guard_id']),
            checkpoint_id=int(request.form['checkpoint_id']),
            gps_location=request.form.get('gps', 'N/A')
        )
        db.session.add(log)
        db.session.commit()
        return jsonify({'status': 'success'})
    return jsonify({'status': 'error'})

@app.route('/api/patrol_logs')
def api_patrol_logs():
    logs = PatrolLog.query.order_by(PatrolLog.timestamp.desc()).limit(10).all()
    return jsonify([{
        'guard_id': log.guard_id,
        'checkpoint': log.checkpoint.name if log.checkpoint else 'Unknown',
        'time': log.timestamp.strftime('%H:%M')
    } for log in logs])

@app.route('/devices')
def devices():
    devices_list = SmartDevice.query.all()
    return render_template('devices.html', devices=devices_list)

@app.route('/device/<int:device_id>/<action>', methods=['POST'])
def control_device(device_id, action):
    device = SmartDevice.query.get_or_404(device_id)
    device.status = action
    db.session.commit()
    return jsonify({'success': True, 'status': action})

@app.route('/add_device', methods=['POST'])
def add_device():
    device = SmartDevice(
        name=request.form['name'],
        type=request.form['type'],
        location=request.form['location']
    )
    db.session.add(device)
    db.session.commit()
    return jsonify({'success': True})

@app.route('/debug')
def debug():
    return f"""
    <h1>🛠️ Database Debug</h1>
    <h3>Residents ({Resident.query.count()})</h3>
    <pre>{', '.join([r.flat for r in Resident.query.all()])}</pre>
    <h3>Checkpoints ({PatrolCheckpoint.query.count()})</h3>
    <h3>Devices ({SmartDevice.query.count()})</h3>
    """

@app.route('/reset')
def reset():
    db.drop_all()
    with app.app_context():
        db.create_all()
        # Re-seed data here if needed
    return "✅ Database reset! Login with A-101"

@app.route('/data')
def show_all_data():
    data = {
        'residents': [{'id': r.id, 'flat': r.flat, 'name': r.name} for r in Resident.query.all()],
        'visitors': [{'name': v.name, 'type': v.visitor_type, 'status': v.status} for v in Visitor.query.all()],
        'staff': [{'name': s.name, 'type': s.type, 'entry': s.entry_time} for s in Staff.query.all()],
        'checkpoints': [{'name': c.name, 'location': c.location} for c in PatrolCheckpoint.query.all()],
        'patrol_logs': [{'guard': p.guard_id, 'checkpoint': p.checkpoint.name if p.checkpoint else '?'} for p in PatrolLog.query.order_by(PatrolLog.id.desc()).limit(5).all()],
        'devices': [{'name': d.name, 'status': d.status} for d in SmartDevice.query.all()]
    }
    return f"""
    <div class='container mt-4'>
        <h1>📊 ALL DATABASE DATA</h1>
        <pre style='background:#f8f9fa; padding:20px; border-radius:10px; overflow:auto; max-height:80vh;'>{json.dumps(data, indent=2)}</pre>
        <a href='/debug' class='btn btn-primary mt-3'>🔧 Debug</a>
        <a href='/reset' class='btn btn-warning mt-3'>🔄 Reset DB</a>
    </div>
    """

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)