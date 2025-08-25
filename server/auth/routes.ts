import type { Express } from 'express';
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { admin } from '../admin.js';
import { requireSession } from './middleware.js';

const router = Router();

// Session creation endpoint - Firebase ID token to HttpOnly cookie
router.post('/session', async (req, res) => {
  try {
    const authHeader = req.headers.authorization || '';
    const idToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

    if (!idToken) {
      return res.status(400).json({ error: 'No Firebase ID token provided' });
    }

    // Verify Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // Upsert user in Firestore (or your database)
    const userRef = admin.firestore().collection('users').doc(uid);
    await userRef.set({
      uid: uid,
      email: decodedToken.email || null,
      displayName: decodedToken.name || null,
      photoURL: decodedToken.picture || null,
      provider: decodedToken.firebase?.sign_in_provider || null,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });

    // Create app session JWT (short TTL)
    const appJwt = jwt.sign(
      { uid: uid }, 
      process.env.APP_JWT_SECRET || 'your-secret-key', 
      { expiresIn: '2h' }
    );

    // Set HttpOnly cookie
    res.cookie('session', appJwt, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 2 * 60 * 60 * 1000, // 2 hours
    });

    return res.json({ 
      ok: true,
      user: {
        uid: uid,
        email: decodedToken.email,
        displayName: decodedToken.name,
        photoURL: decodedToken.picture,
      }
    });

  } catch (error) {
    console.error('Session creation error:', error);
    return res.status(401).json({ error: 'Invalid Firebase token' });
  }
});

// Get current user
router.get('/me', requireSession, async (req, res) => {
  try {
    const uid = (req as any).uid;

    // Get user from Firestore
    const userDoc = await admin.firestore().collection('users').doc(uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = userDoc.data();
    return res.json({
      uid: uid,
      email: userData?.email,
      displayName: userData?.displayName,
      photoURL: userData?.photoURL,
      provider: userData?.provider,
    });

  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).json({ error: 'Failed to get user information' });
  }
});

// Logout endpoint
router.post('/logout', (req, res) => {
  res.clearCookie('session', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });

  return res.json({ 
    ok: true,
    message: 'Logged out successfully' 
  });
});

export function setupAuthRoutes(app: Express) {
  app.use('/api/auth', router);
}