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

async function createUser({ email, name }) {
  const uuid = generateUUID();
  const created_at = new Date().toISOString();
  
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO users (email, name, uuid, resume_path, created_at) VALUES (?, ?, ?, ?, ?)',
      [email, name || null, uuid, null, created_at],
      function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, email, name: name || '', uuid, resume_path: null, created_at });
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

module.exports = {
  getUserByEmail,
  getUserById,
  getUserByUuid,
  createUser,
  updateUserProfile,
  addSave,
  getSavesForViewer,
  getAllUsers,
  getAllSaves,
  getUserStats,
};