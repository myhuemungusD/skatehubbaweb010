import type { Express } from 'express';
import { AuthService } from './service.ts';
import { authenticateUser } from './middleware.ts';
import admin from 'firebase-admin';

export function setupAuthRoutes(app: Express) {
  // Single login/register endpoint - Firebase ID token only
  app.post('/api/auth/login', async (req, res) => {
    try {
      const authHeader = req.headers.authorization ?? '';

      if (!authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Firebase ID token required' });
      }

      const idToken = authHeader.slice('Bearer '.length).trim();

      try {
        // Verify Firebase ID token
        const decoded = await admin.auth().verifyIdToken(idToken, true);
        const uid = decoded.uid;
        const { firstName, lastName, isRegistration } = req.body;

        // Find or create user record
        let user = await AuthService.findUserByFirebaseUid(uid);

        if (!user) {
          // Create new user from Firebase token data
          const { user: newUser } = await AuthService.createUser({
            email: decoded.email || `user${uid.slice(0,8)}@firebase.local`,
            password: 'firebase-auth-user', // Placeholder
            firstName: firstName || decoded.name?.split(' ')[0] || 'User',
            lastName: lastName || decoded.name?.split(' ').slice(1).join(' ') || '',
            firebaseUid: uid,
          });
          user = newUser;
        }

        // Create session token for API access
        const { token: sessionJwt } = await AuthService.createSession(user.id);

        // Update last login
        await AuthService.updateLastLogin(user.id);

        return res.status(200).json({
          user: {
            id: user.id,
            email: user.email,
            displayName: `${user.firstName} ${user.lastName}`.trim(),
            photoUrl: decoded.picture || null,
            roles: [],
            createdAt: user.createdAt,
            provider: 'firebase',
          },
          tokens: { sessionJwt },
          strategy: 'firebase',
        });
      } catch (firebaseError) {
        console.error('Firebase ID token verification failed:', firebaseError);
        return res.status(401).json({ error: 'Invalid Firebase token' });
      }
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ error: 'Login failed' });
    }
  });

  // Get current user endpoint
  app.get('/api/auth/me', authenticateUser, async (req, res) => {
    try {
      const user = req.currentUser!;
      res.json({
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isEmailVerified: user.isEmailVerified,
          lastLoginAt: user.lastLoginAt,
          createdAt: user.createdAt,
        },
      });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({
        error: 'Failed to get user information',
      });
    }
  });

  // Logout endpoint
  app.post('/api/auth/logout', authenticateUser, async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        await AuthService.deleteSession(token);
      }

      res.json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        error: 'Logout failed',
      });
    }
  });
}