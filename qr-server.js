require('dotenv').config();

const path = require('path');
const fs = require('fs');
const express = require('express');
const session = require('express-session');
const multer = require('multer');
const QRCode = require('qrcode');
const crypto = require('crypto');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const cors = require('cors');

const {
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
} = require('./data-sqlite');

const app = express();

// Enable CORS for Next.js frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Ensure required directories exist
const UPLOAD_DIR = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // Set to true in production with HTTPS
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'lax'
  }
}));

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, and DOCX files are allowed.'));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Passport strategies
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/qr/auth/google/callback"
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value;
      if (!email) return done(new Error('No email found'));

      let user = await getUserByEmail(email);
      if (!user) {
        const uuid = crypto.randomUUID();
        user = await createUser(email, null, profile.displayName, uuid);
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }));
}

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "/api/qr/auth/github/callback"
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value;
      if (!email) return done(new Error('No email found'));

      let user = await getUserByEmail(email);
      if (!user) {
        const uuid = crypto.randomUUID();
        user = await createUser(email, null, profile.displayName || profile.username, uuid);
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }));
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await getUserById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Helper functions
const requireAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Authentication required' });
};

const isAdmin = (user) => {
  const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim());
  return adminEmails.includes(user.email);
};

// Routes
app.get('/api/qr/auth/check', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

app.get('/api/qr/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/api/qr/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/qr/login' }),
  (req, res) => {
    const next = req.query.state || '/qr/dashboard';
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}${next}`);
  }
);

app.get('/api/qr/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

app.get('/api/qr/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/qr/login' }),
  (req, res) => {
    const next = req.query.state || '/qr/dashboard';
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}${next}`);
  }
);

app.post('/api/qr/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ success: true });
  });
});

app.get('/api/qr/dashboard', requireAuth, async (req, res) => {
  try {
    const user = req.user;
    const saves = await getSavesForViewer(user.id);
    
    // Generate QR code
    const profileUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/qr/u/${user.uuid}`;
    const qrDataUrl = await QRCode.toDataURL(profileUrl);
    
    res.json({
      user,
      saves,
      qrDataUrl,
      profileUrl,
      isAdmin: isAdmin(user)
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to load dashboard' });
  }
});

app.post('/api/qr/profile', requireAuth, upload.single('resume'), async (req, res) => {
  try {
    const user = req.user;
    const { name } = req.body;
    const resumePath = req.file ? `/uploads/${req.file.filename}` : undefined;
    
    await updateUserProfile(user.id, name, resumePath);
    res.json({ success: true });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

app.get('/api/qr/admin', requireAuth, async (req, res) => {
  try {
    const user = req.user;
    if (!isAdmin(user)) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    const stats = await getUserStats();
    const recentUsers = await getAllUsers(10);
    const recentSaves = await getAllSaves(10);
    
    res.json({ stats, recentUsers, recentSaves });
  } catch (error) {
    console.error('Admin error:', error);
    res.status(500).json({ error: 'Failed to load admin data' });
  }
});

app.get('/api/qr/u/:uuid', async (req, res) => {
  try {
    const { uuid } = req.params;
    const profile = await getUserByUuid(uuid);
    
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    const user = req.user;
    const canSave = user && user.uuid !== uuid;
    
    res.json({ profile, canSave, user });
  } catch (error) {
    console.error('Profile view error:', error);
    res.status(500).json({ error: 'Failed to load profile' });
  }
});

app.post('/api/qr/save/:uuid', requireAuth, async (req, res) => {
  try {
    const { uuid } = req.params;
    const user = req.user;
    
    if (user.uuid === uuid) {
      return res.status(400).json({ error: 'Cannot save your own profile' });
    }
    
    const profile = await getUserByUuid(uuid);
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    await addSave(user.id, profile.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Save profile error:', error);
    res.status(500).json({ error: 'Failed to save profile' });
  }
});

app.get('/api/qr/resume/:uuid', async (req, res) => {
  try {
    const { uuid } = req.params;
    const profile = await getUserByUuid(uuid);
    
    if (!profile || !profile.resume_path) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    
    const filePath = path.join(__dirname, 'public', profile.resume_path);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    res.sendFile(filePath);
  } catch (error) {
    console.error('Resume serve error:', error);
    res.status(500).json({ error: 'Failed to serve resume' });
  }
});

// Serve uploaded files
app.use('/uploads', express.static(UPLOAD_DIR));

const PORT = process.env.QR_SERVER_PORT || 3001;
app.listen(PORT, () => {
  console.log(`QR Profile server running on http://localhost:${PORT}`);
});