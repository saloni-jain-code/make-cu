const sqlite3 = require('sqlite3').verbose();
const crypto = require('crypto');
const path = require('path');

// Create database
const dbPath = path.join(__dirname, 'data', 'app.db');
const db = new sqlite3.Database(dbPath);

// Initialize tables
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    role TEXT,
    name TEXT,
    uuid TEXT UNIQUE NOT NULL,
    resume_path TEXT,
    created_at TEXT NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS saves (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    viewer_user_id INTEGER NOT NULL,
    viewed_user_id INTEGER NOT NULL,
    saved_name TEXT,
    saved_resume_path TEXT,
    saved_at TEXT NOT NULL,
    FOREIGN KEY (viewer_user_id) REFERENCES users (id),
    FOREIGN KEY (viewed_user_id) REFERENCES users (id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS teams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS team_members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    team_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    joined_at TEXT NOT NULL,
    FOREIGN KEY (team_id) REFERENCES teams (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    UNIQUE(team_id, user_id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS hardware_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    cost INTEGER NOT NULL,
    stock INTEGER NOT NULL,
    image_url TEXT,
    category TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS team_purchases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    team_id INTEGER NOT NULL,
    item_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    total_cost INTEGER NOT NULL,
    purchased_at TEXT NOT NULL,
    FOREIGN KEY (team_id) REFERENCES teams (id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES hardware_items (id)
  )`);

  // Insert default hardware items if not exists
  db.get('SELECT COUNT(*) as count FROM hardware_items', [], (err, row) => {
    if (!err && row.count === 0) {
      const items = [
        { name: 'Arduino Uno', description: 'Microcontroller board based on ATmega328P', cost: 25, stock: 20, category: 'Microcontrollers' },
        { name: 'Raspberry Pi 4', description: '4GB RAM single-board computer', cost: 55, stock: 15, category: 'Microcontrollers' },
        { name: 'ESP32 DevKit', description: 'WiFi + Bluetooth microcontroller', cost: 15, stock: 25, category: 'Microcontrollers' },
        { name: 'Breadboard', description: 'Solderless breadboard for prototyping', cost: 5, stock: 50, category: 'Components' },
        { name: 'Jumper Wires (Pack)', description: 'Set of 65 jumper wires', cost: 8, stock: 40, category: 'Components' },
        { name: 'LED Pack (50pcs)', description: 'Assorted color LEDs', cost: 10, stock: 30, category: 'Components' },
        { name: 'Resistor Kit', description: '500pcs resistor assortment', cost: 12, stock: 25, category: 'Components' },
        { name: 'Servo Motor', description: 'SG90 9g micro servo', cost: 8, stock: 35, category: 'Actuators' },
        { name: 'DC Motor', description: '3-6V DC hobby motor', cost: 6, stock: 40, category: 'Actuators' },
        { name: 'Stepper Motor', description: 'NEMA 17 stepper motor', cost: 18, stock: 20, category: 'Actuators' },
        { name: 'Ultrasonic Sensor', description: 'HC-SR04 distance sensor', cost: 5, stock: 30, category: 'Sensors' },
        { name: 'Temperature Sensor', description: 'DHT11 temp & humidity sensor', cost: 7, stock: 25, category: 'Sensors' },
        { name: 'PIR Motion Sensor', description: 'Passive infrared motion detector', cost: 6, stock: 28, category: 'Sensors' },
        { name: 'OLED Display', description: '0.96" 128x64 OLED screen', cost: 12, stock: 20, category: 'Displays' },
        { name: 'LCD Display', description: '16x2 character LCD with I2C', cost: 10, stock: 22, category: 'Displays' },
        { name: 'Battery Pack', description: '4xAA battery holder', cost: 4, stock: 45, category: 'Power' },
        { name: 'Power Supply', description: '5V 2A USB power adapter', cost: 8, stock: 30, category: 'Power' },
        { name: 'Motor Driver', description: 'L298N dual H-bridge driver', cost: 10, stock: 25, category: 'Modules' },
        { name: 'Relay Module', description: '5V relay module for Arduino', cost: 7, stock: 28, category: 'Modules' },
        { name: 'GPS Module', description: 'NEO-6M GPS module', cost: 20, stock: 15, category: 'Modules' }
      ];
      
      const stmt = db.prepare('INSERT INTO hardware_items (name, description, cost, stock, category) VALUES (?, ?, ?, ?, ?)');
      items.forEach(item => {
        stmt.run([item.name, item.description, item.cost, item.stock, item.category]);
      });
      stmt.finalize();
    }
  });
});

function generateUUID() {
  if (crypto.randomUUID) return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (crypto.randomBytes(1)[0] % 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Users
async function getUserByEmail(email) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
      if (err) reject(err);
      else resolve(row || null);
    });
  });
}

async function getUserById(id) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
      if (err) reject(err);
      else resolve(row || null);
    });
  });
}

async function getUserByUuid(uuid) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE uuid = ?', [uuid], (err, row) => {
      if (err) reject(err);
      else resolve(row || null);
    });
  });
}

async function createUser({ email, name, role }) {
  const uuid = generateUUID();
  const created_at = new Date().toISOString();
  
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO users (email, name, role, uuid, resume_path, created_at) VALUES (?, ?, ?, ?, ?, ?)',
      [email, name || null, role || null, uuid, null, created_at],
      function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, email, name: name || '', role: role || null, uuid, resume_path: null, created_at });
      }
    );
  });
}

async function updateUserProfile(id, { name, resume_path }) {
  return new Promise((resolve, reject) => {
    const updates = [];
    const values = [];
    
    if (typeof name !== 'undefined') {
      updates.push('name = ?');
      values.push(name);
    }
    if (typeof resume_path !== 'undefined') {
      updates.push('resume_path = ?');
      values.push(resume_path);
    }
    
    if (updates.length === 0) return resolve();
    
    values.push(id);
    
    db.run(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      values,
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

async function updateUserRole(userId, role) {
  return new Promise((resolve, reject) => {
    db.run(
      'UPDATE users SET role = ? WHERE id = ?',
      [role, userId],
      function(err) {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

// Saves
async function addSave({ viewer_user_id, viewed_user_id, saved_name, saved_resume_path }) {
  const saved_at = new Date().toISOString();
  
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO saves (viewer_user_id, viewed_user_id, saved_name, saved_resume_path, saved_at) VALUES (?, ?, ?, ?, ?)',
      [viewer_user_id, viewed_user_id, saved_name || null, saved_resume_path || null, saved_at],
      function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID });
      }
    );
  });
}

async function getSavesForViewer(viewer_user_id) {
  return new Promise((resolve, reject) => {
    db.all(
      'SELECT * FROM saves WHERE viewer_user_id = ? ORDER BY saved_at DESC',
      [viewer_user_id],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      }
    );
  });
}

// Admin functions
async function getAllUsers() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM users ORDER BY created_at DESC', (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
}

async function getAllSaves() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM saves ORDER BY saved_at DESC', (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
}

async function getUserStats() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM users', (err, users) => {
      if (err) return reject(err);
      
      db.all('SELECT * FROM saves', (err2, saves) => {
        if (err2) return reject(err2);
        
        const totalUsers = users.length;
        const totalSaves = saves.length;
        
        const usersWithProfiles = users.filter(user => user.name || user.resume_path).length;
        
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const sevenDaysAgoISO = sevenDaysAgo.toISOString();
        
        const recentUsers = users.filter(user => user.created_at > sevenDaysAgoISO).length;
        const recentSaves = saves.filter(save => save.saved_at > sevenDaysAgoISO).length;
        
        resolve({
          totalUsers,
          totalSaves,
          usersWithProfiles,
          recentUsers,
          recentSaves
        });
      });
    });
  });
}

// Teams
async function createTeam({ name, password }) {
  const bcrypt = require('bcrypt');
  const password_hash = await bcrypt.hash(password, 10);
  const created_at = new Date().toISOString();
  
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO teams (name, password_hash, created_at) VALUES (?, ?, ?)',
      [name, password_hash, created_at],
      function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, name, created_at });
      }
    );
  });
}

async function getTeamByName(name) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM teams WHERE name = ?', [name], (err, row) => {
      if (err) reject(err);
      else resolve(row || null);
    });
  });
}

async function verifyTeamPassword(teamId, password) {
  const bcrypt = require('bcrypt');
  return new Promise((resolve, reject) => {
    db.get('SELECT password_hash FROM teams WHERE id = ?', [teamId], async (err, row) => {
      if (err) reject(err);
      else if (!row) resolve(false);
      else {
        const match = await bcrypt.compare(password, row.password_hash);
        resolve(match);
      }
    });
  });
}

async function addTeamMember(teamId, userId) {
  const joined_at = new Date().toISOString();
  
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO team_members (team_id, user_id, joined_at) VALUES (?, ?, ?)',
      [teamId, userId, joined_at],
      function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID });
      }
    );
  });
}

async function removeTeamMember(userId) {
  return new Promise((resolve, reject) => {
    db.run(
      'DELETE FROM team_members WHERE user_id = ?',
      [userId],
      function(err) {
        if (err) reject(err);
        else resolve({ changes: this.changes });
      }
    );
  });
}

async function getUserTeam(userId) {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT t.*, tm.joined_at 
       FROM teams t 
       JOIN team_members tm ON t.id = tm.team_id 
       WHERE tm.user_id = ?`,
      [userId],
      (err, row) => {
        if (err) reject(err);
        else resolve(row || null);
      }
    );
  });
}

async function getTeamMembers(teamId) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT u.id, u.name, u.email, tm.joined_at 
       FROM users u 
       JOIN team_members tm ON u.id = tm.user_id 
       WHERE tm.team_id = ?
       ORDER BY tm.joined_at ASC`,
      [teamId],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      }
    );
  });
}

async function getTeamBudget(teamId) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT COUNT(*) as member_count,
       COALESCE(SUM(tp.total_cost), 0) as total_spent
       FROM team_members tm
       LEFT JOIN team_purchases tp ON tm.team_id = tp.team_id
       WHERE tm.team_id = ?
       GROUP BY tm.team_id`,
      [teamId],
      (err, rows) => {
        if (err) reject(err);
        else {
          if (rows && rows.length > 0) {
            const memberCount = rows[0].member_count;
            const totalSpent = rows[0].total_spent;
            const maxBudget = 2000 * Math.min(memberCount, 4);
            const remaining = maxBudget - totalSpent;
            resolve({ maxBudget, totalSpent, remaining, memberCount });
          } else {
            // If no members (shouldn't happen), return zero budget
            resolve({ maxBudget: 0, totalSpent: 0, remaining: 0, memberCount: 0 });
          }
        }
      }
    );
  });
}

// Hardware
async function getHardwareItems() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM hardware_items ORDER BY category, name', [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
}

async function purchaseHardware(teamId, itemId, quantity) {
  const purchased_at = new Date().toISOString();
  
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Get item cost
      db.get('SELECT cost, stock FROM hardware_items WHERE id = ?', [itemId], (err, item) => {
        if (err) return reject(err);
        if (!item) return reject(new Error('Item not found'));
        if (item.stock < quantity) return reject(new Error('Insufficient stock'));
        
        const total_cost = item.cost * quantity;
        
        // Insert purchase
        db.run(
          'INSERT INTO team_purchases (team_id, item_id, quantity, total_cost, purchased_at) VALUES (?, ?, ?, ?, ?)',
          [teamId, itemId, quantity, total_cost, purchased_at],
          function(err) {
            if (err) return reject(err);
            
            // Update stock
            db.run(
              'UPDATE hardware_items SET stock = stock - ? WHERE id = ?',
              [quantity, itemId],
              function(err) {
                if (err) return reject(err);
                resolve({ id: this.lastID, total_cost });
              }
            );
          }
        );
      });
    });
  });
}

async function getTeamPurchases(teamId) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT tp.*, hi.name, hi.description 
       FROM team_purchases tp 
       JOIN hardware_items hi ON tp.item_id = hi.id 
       WHERE tp.team_id = ? 
       ORDER BY tp.purchased_at DESC`,
      [teamId],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      }
    );
  });
}

module.exports = {
  getUserByEmail,
  getUserById,
  getUserByUuid,
  createUser,
  updateUserProfile,
  updateUserRole,
  addSave,
  getSavesForViewer,
  getAllUsers,
  getAllSaves,
  getUserStats,
  createTeam,
  getTeamByName,
  verifyTeamPassword,
  addTeamMember,
  removeTeamMember,
  getUserTeam,
  getTeamMembers,
  getTeamBudget,
  getHardwareItems,
  purchaseHardware,
  getTeamPurchases,
};