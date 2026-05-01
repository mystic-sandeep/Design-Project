/**
 * db.js — Pure JSON file database
 * Replaces sqlite3 (which fails to compile on Node v24).
 * All data is saved to mygate-data.json in this folder.
 * Data persists across server restarts forever.
 */

const fs      = require('fs');
const path    = require('path');
const bcrypt  = require('bcryptjs');

const DATA_FILE = path.join(__dirname, 'mygate-data.json');

function now() { return new Date().toISOString(); }

// ── Seed data (used only on first run) ───────────────────────────────────
const SEED = {
  _ids: {
    users: 6, visitors: 1, vehicles: 1, complaints: 1,
    staff: 4, devices: 6, residents: 4, checkpoints: 5, patrol_logs: 1,
  },
  users: [
    { id:1, email:'admin@mygate.com',    password: bcrypt.hashSync('admin123',10),    role:'admin',    name:'Admin User',     apartment:'A-001' },
    { id:2, email:'guard@mygate.com',    password: bcrypt.hashSync('guard123',10),    role:'guard',    name:'Security Guard', apartment:'G-001' },
    { id:3, email:'resident@mygate.com', password: bcrypt.hashSync('resident123',10), role:'resident', name:'John Resident',  apartment:'B-202' },
    { id:4, email:'staff@mygate.com',    password: bcrypt.hashSync('staff123',10),    role:'staff',    name:'Staff Member',   apartment:'S-001' },
    { id:5, email:'maid@mygate.com',     password: bcrypt.hashSync('maid123',10),     role:'maid',     name:'Maid Worker',    apartment:null    },
  ],
  pending_visitors: [],
  vehicles:         [],
  complaints:       [],
  staff: [
    { id:1, name:'Rajesh Kumar', role:'Plumber',     phone:'9111111111', apartment:'A-Block', status:'active',   check_in:now(), check_out:null,  created_at:now() },
    { id:2, name:'Sunita Devi',  role:'Maid',        phone:'9222222222', apartment:'B-Block', status:'active',   check_in:now(), check_out:null,  created_at:now() },
    { id:3, name:'Ahmed Khan',   role:'Electrician', phone:'9333333333', apartment:'C-Block', status:'inactive', check_in:now(), check_out:now(), created_at:now() },
  ],
  devices: [
    { id:1, name:'Main Gate Camera', type:'camera',   location:'Main Gate',  status:'online',  last_action:null, created_at:now() },
    { id:2, name:'Parking Sensor',   type:'sensor',   location:'Parking',    status:'online',  last_action:null, created_at:now() },
    { id:3, name:'Lift Camera',      type:'camera',   location:'Lift',       status:'online',  last_action:null, created_at:now() },
    { id:4, name:'Pool Light',       type:'light',    location:'Pool Area',  status:'online',  last_action:null, created_at:now() },
    { id:5, name:'Entry Intercom',   type:'intercom', location:'Main Entry', status:'offline', last_action:null, created_at:now() },
  ],
  residents: [
    { id:1, name:'John Resident', email:'resident@mygate.com', apartment:'B-202', phone:'9876543210', status:'active', created_at:now() },
    { id:2, name:'Priya Sharma',  email:'priya@mygate.com',    apartment:'C-101', phone:'9876543211', status:'active', created_at:now() },
    { id:3, name:'Ravi Kumar',    email:'ravi@mygate.com',     apartment:'A-303', phone:'9876543212', status:'active', created_at:now() },
  ],
  patrol_checkpoints: [
    { id:1, name:'Gate A',    location:'North Entry', created_at:now() },
    { id:2, name:'Gate B',    location:'South Entry', created_at:now() },
    { id:3, name:'Parking',   location:'Basement',    created_at:now() },
    { id:4, name:'Pool Area', location:'Garden',      created_at:now() },
  ],
  patrol_logs: [],
};

// ── Load or initialise ────────────────────────────────────────────────────
let DATA;
if (fs.existsSync(DATA_FILE)) {
  try {
    DATA = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    console.log('📂 Database loaded from mygate-data.json');
  } catch (e) {
    console.error('⚠️  Corrupt data file, resetting:', e.message);
    DATA = SEED;
  }
} else {
  DATA = SEED;
  console.log('🌱 First run — seeding mygate-data.json');
}

// ── Persist ───────────────────────────────────────────────────────────────
function save() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(DATA, null, 2), 'utf8');
}
// Save immediately on first run
save();

// ── ID helper ─────────────────────────────────────────────────────────────
function nextId(table) {
  const id = DATA._ids[table]++;
  save();
  return id;
}

// ── Exported DB interface ─────────────────────────────────────────────────
// Mirrors the sqlite3 callback style but is synchronous+persistent
module.exports = {
  DATA,
  save,
  nextId,
  now,
};