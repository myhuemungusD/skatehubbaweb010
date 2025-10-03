
import type { Request, Response, NextFunction } from 'express';
import { AuthService } from './service.ts';
import type { CustomUser } from '../../shared/schema.ts';
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

// Middleware to authenticate requests - Firebase ID token only
export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Firebase ID token required' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    try {
      // Verify Firebase ID token
      const decoded = await admin.auth().verifyIdToken(token, true);
      const user = await AuthService.findUserByFirebaseUid(decoded.uid);
      
      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      if (!user.isActive) {
        return res.status(401).json({ error: 'Account is deactivated' });
      }

      req.currentUser = user;
      next();
    } catch (firebaseError) {
      console.error('Firebase token verification failed:', firebaseError);
      return res.status(401).json({ error: 'Invalid Firebase token' });
    }
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
      try {
        const decoded = await admin.auth().verifyIdToken(token, true);
        const user = await AuthService.findUserByFirebaseUid(decoded.uid);
        if (user && user.isActive) {
          req.currentUser = user;
        }
      } catch {
        // Ignore authentication errors in optional mode
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
