import type { Request, Response, NextFunction } from 'express';
import { AuthService } from './service.js';
import type { CustomUser } from '../../shared/schema.js';
import admin from 'firebase-admin';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    });
    console.log('Firebase Admin SDK initialized');
  } catch (error) {
    console.warn('Firebase Admin initialization failed:', error);
  }
}

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      currentUser?: CustomUser;
    }
  }
}

// Middleware to authenticate requests - handles both Firebase and session tokens
export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    try {
      // First try Firebase ID token verification
      if (admin.apps.length > 0) {
        const decoded = await admin.auth().verifyIdToken(token, true);
        const user = await AuthService.findUserByFirebaseUid(decoded.uid);
        
        if (user && user.isActive) {
          req.currentUser = user;
          return next();
        }
      }
    } catch (firebaseError) {
      // If Firebase token fails, try session token
    }

    // Fallback to session token validation
    const user = await AuthService.validateSession(token);

    if (!user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    if (!user.isActive) {
      return res.status(401).json({ error: 'Account is deactivated' });
    }

    req.currentUser = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

// Optional authentication - sets user if token is valid, but doesn't require it
export const optionalAuthentication = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const user = await AuthService.validateSession(token);
      if (user && user.isActive) {
        req.currentUser = user;
      }
    }
    next();
  } catch (error) {
    // Ignore authentication errors in optional mode
    next();
  }
};

// Middleware to require email verification
export const requireEmailVerification = (req: Request, res: Response, next: NextFunction) => {
  if (!req.currentUser) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if (!req.currentUser.isEmailVerified) {
    return res.status(403).json({ 
      error: 'Email verification required',
      code: 'EMAIL_NOT_VERIFIED'
    });
  }

  next();
};

// Simple session middleware for JWT cookies
export function requireSession(req: Request, res: Response, next: NextFunction) {
  const token = (req as any).cookies?.session;
  if (!token) {
    return res.status(401).json({ error: "No session token" });
  }
  
  try {
    const jwt = require('jsonwebtoken');
    const payload = jwt.verify(token, process.env.APP_JWT_SECRET || 'your-secret-key');
    (req as any).uid = (payload as any).uid;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid session token" });
  }
}