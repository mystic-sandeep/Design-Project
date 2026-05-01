/**
 * MyGate Server
 * ─────────────────────────────────────────────────────
 *  • No native modules → works on Node v16 – v24+
 *  • Data saved to mygate-data.json (persists forever)
 *  • JWT authentication + RBAC on every route
 *  • Serves frontend from same folder (port 8080)
 * ─────────────────────────────────────────────────────
 */

const express = require('express');
const cors    = require('cors');
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const path    = require('path');
const { DATA, save, nextId, now } = require('./db');
const { generateToken, authMiddleware, requirePermission, getRoleInfo, ROLES } = require('./auth');

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));   // serves index.html + dashboards/

// ── Helpers ───────────────────────────────────────────────────────────────
function genPasscode() {
  const c = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 8 }, () => c[Math.floor(Math.random() * c.length)]).join('');
}

function ok(res, msg, data = {}, extra = {}) {
  res.json({ success: true, message: msg, data, timestamp: Date.now(), ...extra });
}

function err(res, status, msg) {
  if (typeof status === 'string') { msg = status; status = 500; }
  res.status(status).json({ success: false, error: msg });
}

// ════════════════════════════════════════════════════════════════════════
//  AUTH
// ════════════════════════════════════════════════════════════════════════
app.post('/api/auth/login', (req, res) => {
  const { email, password, role } = req.body || {};
  if (!email || !password) return err(res, 400, 'Email and password required');
  if (!ROLES[role])        return err(res, 400, 'Invalid role');

  const user = DATA.users.find(u => u.email === email);
  if (!user)                                         return err(res, 401, 'Invalid credentials');
  if (user.role !== role)                            return err(res, 403, `This account is not a ${role}`);
  if (!bcrypt.compareSync(password, user.password))  return err(res, 401, 'Invalid credentials');

  const token    = generateToken(String(user.id), user.email, user.role);
  const roleInfo = getRoleInfo(user.role);

  ok(res, 'Login successful', {}, {
    token,
    user: {
      id:          user.id,
      email:       user.email,
      name:        user.name,
      apartment:   user.apartment,
      role:        user.role,
      roleDisplay: roleInfo.displayName,
      permissions: roleInfo.permissions,
    },
  });
});

app.post('/api/auth/verify', authMiddleware, (req, res) => {
  const roleInfo = getRoleInfo(req.user.role);
  ok(res, 'Token valid', {}, {
    user: {
      id:          req.user.userId,
      email:       req.user.email,
      role:        req.user.role,
      roleDisplay: roleInfo.displayName,
      permissions: roleInfo.permissions,
    },
  });
});

// ════════════════════════════════════════════════════════════════════════
//  GUARD
// ════════════════════════════════════════════════════════════════════════
const approvedQueue = [];  // in-memory queue for real-time guard popups

app.post('/api/v2/guard/register-visitor',
  authMiddleware, requirePermission('registerVisitor'),
  (req, res) => {
    const { visitorName, apartmentNumber, contactNumber, reasonOfVisit } = req.body || {};
    if (!visitorName) return err(res, 400, 'Visitor name required');

    const passCode = genPasscode();
    DATA.pending_visitors.push({
      id:              nextId('visitors'),
      visitor_name:    visitorName,
      apartment_number: apartmentNumber || '',
      contact_number:  contactNumber   || '',
      reason_of_visit: reasonOfVisit   || '',
      pass_code:       passCode,
      status:          'pending',
      registered_at:   now(),
      approved_at:     null,
    });
    save();
    ok(res, '✅ Visitor registered', { passCode, visitorName, apartmentNumber });
  }
);

app.get('/api/v2/guard/poll-approvals',
  authMiddleware, requirePermission('registerVisitor'),
  (req, res) => {
    const approvals = [...approvedQueue];
    approvedQueue.length = 0;
    ok(res, '✅ Approvals fetched', { approvals });
  }
);

app.post('/api/v2/guard/mark-entry',  authMiddleware, requirePermission('markEntry'),  (req, res) => ok(res, '✅ Entry marked', {}));
app.post('/api/v2/guard/mark-exit',   authMiddleware, requirePermission('markExit'),   (req, res) => ok(res, '✅ Exit marked',  {}));
app.post('/api/v2/guard/check-in',    authMiddleware, requirePermission('checkIn'),    (req, res) => ok(res, '✅ Checked in',   { time: now() }));
app.post('/api/v2/guard/check-out',   authMiddleware, requirePermission('checkOut'),   (req, res) => ok(res, '✅ Checked out',  { time: now() }));

app.post('/api/v2/guard/log-vehicle',
  authMiddleware, requirePermission('logVehicle'),
  (req, res) => {
    const { vehicleNumber, category, ownerName } = req.body || {};
    if (!vehicleNumber) return err(res, 400, 'vehicleNumber required');
    const timeLogged = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    DATA.vehicles.push({
      id:             nextId('vehicles'),
      vehicle_number: vehicleNumber,
      category:       category  || 'Car',
      owner_name:     ownerName || '',
      logged_by:      req.user.email,
      time_logged:    now(),
    });
    save();
    ok(res, '✅ Vehicle logged', { vehicleNumber, category, timeLogged });
  }
);

// ════════════════════════════════════════════════════════════════════════
//  RESIDENT
// ════════════════════════════════════════════════════════════════════════
app.post('/api/v2/resident/approve-visitor',
  authMiddleware, requirePermission('approveVisitor'),
  (req, res) => {
    const { passCode } = req.body || {};
    const visitor = DATA.pending_visitors.find(v => v.pass_code === passCode && v.status === 'pending');
    if (!visitor) return err(res, 404, 'Invalid or expired passcode');

    visitor.status      = 'approved';
    visitor.approved_at = now();
    save();

    approvedQueue.push({
      visitorName:     visitor.visitor_name,
      apartmentNumber: visitor.apartment_number,
      passCode,
      approvedAt:      Date.now(),
    });

    ok(res, '✅ Visitor approved', {
      visitorName:     visitor.visitor_name,
      apartmentNumber: visitor.apartment_number,
      status:          'Approved',
    });
  }
);

app.get('/api/v2/resident/bills',
  authMiddleware, requirePermission('viewBills'),
  (req, res) => ok(res, '✅ Bills retrieved', { pendingAmount: 5000, currency: 'INR', dueDate: '2025-06-01' })
);

app.post('/api/v2/resident/file-complaint',
  authMiddleware, requirePermission('fileComplaint'),
  (req, res) => {
    const { subject, description } = req.body || {};
    DATA.complaints.push({
      id:          nextId('complaints'),
      resident_id: req.user.userId,
      subject:     subject     || 'General',
      description: description || '',
      status:      'open',
      created_at:  now(),
    });
    save();
    ok(res, '✅ Complaint filed', { status: 'Open' });
  }
);

app.post('/api/v2/resident/hire-maid',       authMiddleware, requirePermission('hireMaid'),       (req, res) => ok(res, '✅ Maid hired',      { status: 'Hired'   }));
app.post('/api/v2/resident/manage-vehicles', authMiddleware, requirePermission('manageVehicles'), (req, res) => ok(res, '✅ Vehicle managed', { status: 'Logged'  }));

// ════════════════════════════════════════════════════════════════════════
//  ADMIN — STATS
// ════════════════════════════════════════════════════════════════════════
app.get('/api/v2/admin/stats',
  authMiddleware, requirePermission('manageUsers'),
  (req, res) => {
    const today = new Date().toDateString();
    ok(res, 'Stats fetched', {
      guestsToday:    DATA.pending_visitors.filter(v => new Date(v.registered_at).toDateString() === today).length,
      activeStaff:    DATA.staff.filter(s => s.status === 'active').length,
      devicesOnline:  DATA.devices.filter(d => d.status === 'online').length,
      totalResidents: DATA.residents.length,
      patrolComplete: DATA.patrol_logs.length,
    });
  }
);

// ════════════════════════════════════════════════════════════════════════
//  ADMIN — VISITORS
// ════════════════════════════════════════════════════════════════════════
app.get('/api/v2/admin/visitors',
  authMiddleware, requirePermission('manageUsers'),
  (req, res) => ok(res, 'Visitors fetched', { visitors: [...DATA.pending_visitors].reverse().slice(0, 100) })
);

app.post('/api/v2/admin/visitors',
  authMiddleware, requirePermission('manageUsers'),
  (req, res) => {
    const { visitorName, apartmentNumber, contactNumber, reasonOfVisit } = req.body || {};
    const passCode = genPasscode();
    DATA.pending_visitors.push({
      id: nextId('visitors'), visitor_name: visitorName, apartment_number: apartmentNumber,
      contact_number: contactNumber || '', reason_of_visit: reasonOfVisit || '',
      pass_code: passCode, status: 'approved', registered_at: now(), approved_at: now(),
    });
    save();
    ok(res, 'Visitor added', { passCode });
  }
);

app.put('/api/v2/admin/visitors/:id/status',
  authMiddleware, requirePermission('manageUsers'),
  (req, res) => {
    const v = DATA.pending_visitors.find(v => v.id == req.params.id);
    if (v) { v.status = req.body.status; save(); }
    ok(res, 'Status updated', {});
  }
);

app.delete('/api/v2/admin/visitors/:id',
  authMiddleware, requirePermission('manageUsers'),
  (req, res) => {
    const i = DATA.pending_visitors.findIndex(v => v.id == req.params.id);
    if (i !== -1) { DATA.pending_visitors.splice(i, 1); save(); }
    ok(res, 'Visitor deleted', {});
  }
);

// ════════════════════════════════════════════════════════════════════════
//  ADMIN — STAFF
// ════════════════════════════════════════════════════════════════════════
app.get('/api/v2/admin/staff',
  authMiddleware, requirePermission('manageUsers'),
  (req, res) => ok(res, 'Staff fetched', { staff: [...DATA.staff].reverse() })
);

app.post('/api/v2/admin/staff',
  authMiddleware, requirePermission('manageUsers'),
  (req, res) => {
    const { name, role, phone, apartment } = req.body || {};
    const s = { id: nextId('staff'), name, role, phone, apartment, status: 'active', check_in: now(), check_out: null, created_at: now() };
    DATA.staff.push(s);
    save();
    ok(res, 'Staff recorded', { id: s.id });
  }
);

app.post('/api/v2/admin/staff/:id/exit',
  authMiddleware, requirePermission('manageUsers'),
  (req, res) => {
    const s = DATA.staff.find(s => s.id == req.params.id);
    if (s) { s.status = 'inactive'; s.check_out = now(); save(); }
    ok(res, 'Exit recorded', {});
  }
);

app.delete('/api/v2/admin/staff/:id',
  authMiddleware, requirePermission('manageUsers'),
  (req, res) => {
    const i = DATA.staff.findIndex(s => s.id == req.params.id);
    if (i !== -1) { DATA.staff.splice(i, 1); save(); }
    ok(res, 'Staff deleted', {});
  }
);

// ════════════════════════════════════════════════════════════════════════
//  ADMIN — PATROL
// ════════════════════════════════════════════════════════════════════════
app.get('/api/v2/admin/patrol/checkpoints',
  authMiddleware, requirePermission('manageUsers'),
  (req, res) => ok(res, 'Checkpoints fetched', { checkpoints: DATA.patrol_checkpoints })
);

app.post('/api/v2/admin/patrol/checkpoints',
  authMiddleware, requirePermission('manageUsers'),
  (req, res) => {
    const cp = { id: nextId('checkpoints'), name: req.body.name, location: req.body.location || '', created_at: now() };
    DATA.patrol_checkpoints.push(cp);
    save();
    ok(res, 'Checkpoint added', { id: cp.id });
  }
);

app.get('/api/v2/admin/patrol/logs',
  authMiddleware, requirePermission('manageUsers'),
  (req, res) => {
    const logs = [...DATA.patrol_logs].reverse().slice(0, 50).map(l => ({
      ...l,
      checkpoint_name: DATA.patrol_checkpoints.find(c => c.id == l.checkpoint_id)?.name || 'Unknown',
    }));
    ok(res, 'Logs fetched', { logs });
  }
);

app.post('/api/v2/admin/patrol/log',
  authMiddleware, requirePermission('manageUsers'),
  (req, res) => {
    DATA.patrol_logs.push({ id: nextId('patrol_logs'), checkpoint_id: req.body.checkpointId, guard_name: req.body.guardName, status: 'completed', logged_at: now() });
    save();
    ok(res, 'Patrol logged', {});
  }
);

// ════════════════════════════════════════════════════════════════════════
//  ADMIN — DEVICES
// ════════════════════════════════════════════════════════════════════════
app.get('/api/v2/admin/devices',
  authMiddleware, requirePermission('manageUsers'),
  (req, res) => ok(res, 'Devices fetched', { devices: DATA.devices })
);

app.post('/api/v2/admin/devices',
  authMiddleware, requirePermission('manageUsers'),
  (req, res) => {
    const d = { id: nextId('devices'), name: req.body.name, type: req.body.type || 'other', location: req.body.location || '', status: 'online', last_action: null, created_at: now() };
    DATA.devices.push(d);
    save();
    ok(res, 'Device added', { id: d.id });
  }
);

app.put('/api/v2/admin/devices/:id/control',
  authMiddleware, requirePermission('manageUsers'),
  (req, res) => {
    const d = DATA.devices.find(d => d.id == req.params.id);
    if (d) { d.status = req.body.action === 'online' ? 'online' : 'offline'; d.last_action = req.body.action; save(); }
    ok(res, 'Device controlled', { status: d?.status });
  }
);

app.delete('/api/v2/admin/devices/:id',
  authMiddleware, requirePermission('manageUsers'),
  (req, res) => {
    const i = DATA.devices.findIndex(d => d.id == req.params.id);
    if (i !== -1) { DATA.devices.splice(i, 1); save(); }
    ok(res, 'Device deleted', {});
  }
);

// ════════════════════════════════════════════════════════════════════════
//  ADMIN — RESIDENTS
// ════════════════════════════════════════════════════════════════════════
app.get('/api/v2/admin/residents',
  authMiddleware, requirePermission('manageUsers'),
  (req, res) => ok(res, 'Residents fetched', { residents: [...DATA.residents].reverse() })
);

app.post('/api/v2/admin/residents',
  authMiddleware, requirePermission('manageUsers'),
  (req, res) => {
    const { name, email, apartment, phone } = req.body || {};
    const r = { id: nextId('residents'), name, email: email || '', apartment: apartment || '', phone: phone || '', status: 'active', created_at: now() };
    DATA.residents.push(r);
    save();
    ok(res, 'Resident added', { id: r.id });
  }
);

app.delete('/api/v2/admin/residents/:id',
  authMiddleware, requirePermission('manageUsers'),
  (req, res) => {
    const i = DATA.residents.findIndex(r => r.id == req.params.id);
    if (i !== -1) { DATA.residents.splice(i, 1); save(); }
    ok(res, 'Resident deleted', {});
  }
);

// ════════════════════════════════════════════════════════════════════════
//  ADMIN — VEHICLES
// ════════════════════════════════════════════════════════════════════════
app.get('/api/v2/admin/vehicles',
  authMiddleware, requirePermission('manageUsers'),
  (req, res) => ok(res, 'Vehicles fetched', { vehicles: [...DATA.vehicles].reverse().slice(0, 100) })
);

// ════════════════════════════════════════════════════════════════════════
//  STAFF / MAID
// ════════════════════════════════════════════════════════════════════════
app.post('/api/v2/staff/check-in',  authMiddleware, requirePermission('checkIn'),  (req, res) => ok(res, '✅ Checked in',  { time: now() }));
app.post('/api/v2/staff/check-out', authMiddleware, requirePermission('checkOut'), (req, res) => ok(res, '✅ Checked out', { time: now() }));
app.post('/api/v2/maid/check-in',   authMiddleware, requirePermission('checkIn'),  (req, res) => ok(res, '✅ Checked in',  { time: now() }));
app.post('/api/v2/maid/check-out',  authMiddleware, requirePermission('checkOut'), (req, res) => ok(res, '✅ Checked out', { time: now() }));

// ════════════════════════════════════════════════════════════════════════
//  FALLBACK → index.html
// ════════════════════════════════════════════════════════════════════════
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

// ════════════════════════════════════════════════════════════════════════
//  START
// ════════════════════════════════════════════════════════════════════════
app.listen(PORT, () => {
  console.log(`\n🚀 MyGate → http://localhost:${PORT}`);
  console.log(`💾 Data   → ${path.join(__dirname, 'mygate-data.json')}\n`);
  console.log('  admin@mygate.com    / admin123');
  console.log('  guard@mygate.com    / guard123');
  console.log('  resident@mygate.com / resident123');
  console.log('  staff@mygate.com    / staff123');
  console.log('  maid@mygate.com     / maid123\n');
});