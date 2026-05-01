const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'database.json');

// Default structure
const defaultData = {
  users: [],
  pending_visitors: [],
  vehicles: [],
  complaints: []
};

// Load DB
function loadDB() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2));
  }
  return JSON.parse(fs.readFileSync(DB_FILE));
}

// Save DB
function saveDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

module.exports = { loadDB, saveDB };