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
} = require('./data-supabase');


const app = express();

// Enable CORS for Next.js frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

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

const upload = multer({ storage: multer.memoryStorage() });

// Passport strategies
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/hackers/auth/google/callback"
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value;
      if (!email) return done(new Error('No email found'));

      let user = await getUserByEmail(email);
      if (!user) {
        user = await createUser({ 
          email, 
          name: profile.displayName 
        });
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
    callbackURL: "/api/hackers/auth/github/callback"
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // GitHub might not return email if user has it set to private
      // Use the actual email if available, otherwise use GitHub's noreply format
      let email = profile.emails?.[0]?.value;
      
      if (!email) {
        // Fallback to GitHub's noreply email format
        const githubId = profile.id;
        const username = profile.username || 'user';
        email = `${githubId}+${username}@users.noreply.github.com`;
      }

      let user = await getUserByEmail(email);
      if (!user) {
        user = await createUser({ 
          email, 
          name: profile.displayName || profile.username 
        });
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
app.get('/api/hackers/auth/check', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

// Only register Google OAuth routes if credentials are configured
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  app.get('/api/hackers/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

  app.get('/api/hackers/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/hackers/login' }),
    (req, res) => {
      const next = req.query.state || '/hackers/dashboard';
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}${next}`);
    }
  );
} else {
  app.get('/api/hackers/auth/google', (req, res) => {
    res.status(503).json({ error: 'Google OAuth is not configured on this server' });
  });
}

// Only register GitHub OAuth routes if credentials are configured
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  app.get('/api/hackers/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

  app.get('/api/hackers/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/hackers/login' }),
    (req, res) => {
      const next = req.query.state || '/hackers/dashboard';
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}${next}`);
    }
  );
} else {
  app.get('/api/hackers/auth/github', (req, res) => {
    res.status(503).json({ error: 'GitHub OAuth is not configured on this server' });
  });
}

app.post('/api/hackers/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ success: true });
  });
});

app.post('/api/hackers/role', requireAuth, async (req, res) => {
  try {
    const { role } = req.body;
    const user = req.user;
    
    if (!role || (role !== 'hacker' && role !== 'sponsor')) {
      return res.status(400).json({ error: 'Invalid role. Must be "hacker" or "sponsor"' });
    }
    
    await updateUserRole(user.id, role);
    res.json({ success: true });
  } catch (error) {
    console.error('Set role error:', error);
    res.status(500).json({ error: 'Failed to set role' });
  }
});

app.get('/api/hackers/dashboard', requireAuth, async (req, res) => {
  try {
    const user = req.user;
    const saves = await getSavesForViewer(user.id);
    
    // Generate QR code
    const profileUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/hackers/u/${user.uuid}`;
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

app.post('/api/hackers/profile', requireAuth, upload.single('resume'), async (req, res) => {
  try {
    const user = req.user;
    const { name } = req.body;

    let resumeUrl;

    if (req.file) {
      const supabase = require('@supabase/supabase-js').createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      );

      const fileExt = path.extname(req.file.originalname);
      const fileName = `${user.uuid}${fileExt}`;
      const filePath = `resumes/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Get the public URL for the resume
      const { data: { publicUrl } } = supabase.storage
        .from('resumes')
        .getPublicUrl(filePath);

      resumeUrl = publicUrl;
    }

    await updateUserProfile(user.id, name, resumeUrl);
    res.json({ success: true });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

app.get('/api/hackers/admin', requireAuth, async (req, res) => {
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

app.get('/api/hackers/u/:uuid', async (req, res) => {
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

app.post('/api/hackers/save/:uuid', requireAuth, async (req, res) => {
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
    
    await addSave({
      viewer_user_id: user.id,
      viewed_user_id: profile.id,
      saved_name: profile.name,
      saved_resume_path: profile.resume_path
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Save profile error:', error);
    res.status(500).json({ error: 'Failed to save profile' });
  }
});

app.get('/api/hackers/resume/:uuid', async (req, res) => {
  try {
    const { uuid } = req.params;

    const profile = await getUserByUuid(uuid);
    if (!profile || !profile.resume_path) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    // redirect to the public Supabase URL
    res.redirect(profile.resume_path);

  } catch (error) {
    console.error('Resume serve error:', error);
    res.status(500).json({ error: 'Failed to serve resume' });
  }
});

// Team Management
app.post('/api/hackers/teams/create', requireAuth, async (req, res) => {
  try {
    const { name, password } = req.body;
    const user = req.user;
    
    // Only hackers can create teams
    if (user.role !== 'hacker') {
      return res.status(403).json({ error: 'Only hackers can create teams' });
    }
    
    if (!name || !password) {
      return res.status(400).json({ error: 'Team name and password are required' });
    }
    
    // Check if user is already in a team
    const existingTeam = await getUserTeam(user.id);
    if (existingTeam) {
      return res.status(400).json({ error: 'You are already in a team. Leave your current team first.' });
    }
    
    // Check if team name already exists
    const teamExists = await getTeamByName(name);
    if (teamExists) {
      return res.status(400).json({ error: 'Team name already taken' });
    }
    
    const team = await createTeam({ name, password });
    await addTeamMember(team.id, user.id);
    
    res.json({ success: true, team });
  } catch (error) {
    console.error('Create team error:', error);
    res.status(500).json({ error: 'Failed to create team' });
  }
});

app.post('/api/hackers/teams/join', requireAuth, async (req, res) => {
  try {
    const { name, password } = req.body;
    const user = req.user;
    
    // Only hackers can join teams
    if (user.role !== 'hacker') {
      return res.status(403).json({ error: 'Only hackers can join teams' });
    }
    
    if (!name || !password) {
      return res.status(400).json({ error: 'Team name and password are required' });
    }
    
    // Check if user is already in a team
    const existingTeam = await getUserTeam(user.id);
    if (existingTeam) {
      return res.status(400).json({ error: 'You are already in a team. Leave your current team first.' });
    }
    
    const team = await getTeamByName(name);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }
    
    const passwordMatch = await verifyTeamPassword(team.id, password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Incorrect password' });
    }
    
    await addTeamMember(team.id, user.id);
    
    res.json({ success: true, team });
  } catch (error) {
    console.error('Join team error:', error);
    res.status(500).json({ error: 'Failed to join team' });
  }
});

app.post('/api/hackers/teams/leave', requireAuth, async (req, res) => {
  try {
    const user = req.user;
    
    const team = await getUserTeam(user.id);
    if (!team) {
      return res.status(400).json({ error: 'You are not in a team' });
    }
    
    await removeTeamMember(user.id);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Leave team error:', error);
    res.status(500).json({ error: 'Failed to leave team' });
  }
});

app.get('/api/hackers/teams/current', requireAuth, async (req, res) => {
  try {
    const user = req.user;
    
    const team = await getUserTeam(user.id);
    if (!team) {
      return res.json({ team: null });
    }
    
    const members = await getTeamMembers(team.id);
    const budget = await getTeamBudget(team.id);
    const purchases = await getTeamPurchases(team.id);
    
    res.json({ team, members, budget, purchases });
  } catch (error) {
    console.error('Get team error:', error);
    res.status(500).json({ error: 'Failed to get team info' });
  }
});

// Hardware Shop
app.get('/api/hackers/shop', requireAuth, async (req, res) => {
  try {
    const user = req.user;
    
    // Only hackers can access the shop
    if (user.role !== 'hacker') {
      return res.status(403).json({ error: 'Only hackers can access the hardware shop' });
    }
    
    // Check if user is in a team
    const team = await getUserTeam(user.id);
    if (!team) {
      return res.status(400).json({ error: 'You must be in a team to access the shop' });
    }
    
    const items = await getHardwareItems();
    const budget = await getTeamBudget(team.id);
    
    res.json({ items, budget, team });
  } catch (error) {
    console.error('Get shop error:', error);
    res.status(500).json({ error: 'Failed to load shop' });
  }
});

app.post('/api/hackers/shop/purchase', requireAuth, async (req, res) => {
  try {
    const user = req.user;
    const { itemId, quantity } = req.body;
    
    // Only hackers can purchase
    if (user.role !== 'hacker') {
      return res.status(403).json({ error: 'Only hackers can purchase hardware' });
    }
    
    if (!itemId || !quantity || quantity < 1) {
      return res.status(400).json({ error: 'Invalid item or quantity' });
    }
    
    // Check if user is in a team
    const team = await getUserTeam(user.id);
    if (!team) {
      return res.status(400).json({ error: 'You must be in a team to purchase items' });
    }
    
    // Check budget
    const budget = await getTeamBudget(team.id);
    const items = await getHardwareItems();
    const item = items.find(i => i.id === itemId);
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    const totalCost = item.cost * quantity;
    if (totalCost > budget.remaining) {
      return res.status(400).json({ error: 'Insufficient budget' });
    }
    
    await purchaseHardware(team.id, itemId, quantity);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Purchase error:', error);
    res.status(500).json({ error: error.message || 'Failed to purchase item' });
  }
});

const PORT = process.env.QR_SERVER_PORT || 3001;
app.listen(PORT, () => {
  console.log(`QR Profile server running on http://localhost:${PORT}`);
});