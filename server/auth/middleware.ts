import type { Request, Response, NextFunction } from 'express';
import { AuthService } from './service.ts';
import type { CustomUser } from '../../shared/schema.ts';
import { admin } from '../admin.ts';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      currentUser?: CustomUser;
    }
  }
}

/**
 * Authentication middleware to protect routes
 * 
 * Verifies user authentication through:
 * 1. HttpOnly session cookie (preferred - XSS safe)
 * 2. Firebase ID token in Authorization header (fallback)
 * 
 * Adds authenticated user to req.currentUser if valid
 * 
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Option 1: Check for HttpOnly session cookie (PREFERRED - XSS safe)
    const sessionToken = req.cookies?.sessionToken;
    
    if (sessionToken) {
      try {
        // Verify session JWT and get user
        const user = await AuthService.validateSession(sessionToken);
        
        if (!user) {
          return res.status(401).json({ error: 'Invalid session' });
        }

        if (!user.isActive) {
          return res.status(401).json({ error: 'Account is deactivated' });
        }

        req.currentUser = user;
        return next();
      } catch (sessionError) {
        console.error('Session verification failed:', sessionError);
        // Fall through to try Authorization header
      }
    }

    // Option 2: Fallback to Authorization header (for backward compatibility)
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required' });
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

/**
 * Optional authentication middleware
 * 
 * Attempts to authenticate user but doesn't require authentication.
 * Useful for endpoints that provide different content for authenticated vs anonymous users.
 * Sets req.currentUser if authentication succeeds, continues either way.
 * 
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
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

/**
 * Email verification requirement middleware
 * 
 * Requires that the authenticated user has verified their email address.
 * Must be used after authenticateUser middleware.
 * 
 * @param req - Express request object with currentUser
 * @param res - Express response object
 * @param next - Express next function
 */
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
