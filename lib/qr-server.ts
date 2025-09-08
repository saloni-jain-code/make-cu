// This file contains the Express server logic that can be imported by Next.js API routes
import express from 'express';
import session from 'express-session';
import multer from 'multer';
import QRCode from 'qrcode';
import crypto from 'crypto';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import path from 'path';
import fs from 'fs';

// Import database functions
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
} = require('../data-sqlite');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

export const upload = multer({ 
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

// Helper functions
export const requireAuth = (req: any, res: any, next: any) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Authentication required' });
};

export const isAdmin = (user: any) => {
  const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map((e: string) => e.trim());
  return adminEmails.includes(user?.email);
};

// Database functions export
export const db = {
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

// QR Code generation
export const generateQRCode = async (url: string): Promise<string> => {
  return await QRCode.toDataURL(url);
};

// Passport configuration
export const configurePassport = () => {
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

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await getUserById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};