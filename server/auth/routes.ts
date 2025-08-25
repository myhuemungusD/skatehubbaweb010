import type { Express } from 'express';
import { AuthService } from './service.js';
import { authenticateUser } from './middleware.js';
import {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../../shared/schema.js';
import { sendVerificationEmail, sendPasswordResetEmail } from './email.js';
import admin from 'firebase-admin';

export function setupAuthRoutes(app: Express) {
  // Register endpoint
  app.post('/api/auth/register', async (req, res) => {
    try {
      const validation = registerSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({
          error: 'Validation failed',
          details: validation.error.flatten(),
        });
      }

      const { email, password, firstName, lastName } = validation.data;

      // Check if user already exists
      const existingUser = await AuthService.findUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          error: 'An account with this email already exists',
        });
      }

      // Extract Firebase UID if provided
      const firebaseUid = req.body.firebaseUid;
      
      // Create user
      const { user, emailToken } = await AuthService.createUser({
        email,
        password,
        firstName,
        lastName,
        firebaseUid,
      });

      // Send verification email
      try {
        await sendVerificationEmail(user.email, emailToken, `${user.firstName} ${user.lastName}`);
      } catch (emailError) {
        console.error('Failed to send verification email:', emailError);
        // Continue with registration even if email fails
      }

      // Different response based on auth type
      if (firebaseUid) {
        res.status(201).json({
          ok: true,
          msg: 'Account created successfully! Welcome to SkateHubba.',
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            isEmailVerified: user.isEmailVerified,
            firebaseUid: user.firebaseUid,
          },
        });
      } else {
        res.status(201).json({
          ok: true,
          msg: 'Account created successfully! Please check your email to verify your account.',
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            isEmailVerified: user.isEmailVerified,
          },
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        error: 'Registration failed. Please try again.',
      });
    }
  });

  // Login endpoint - Clean separation of Firebase and custom auth
  app.post('/api/auth/login', async (req, res) => {
    try {
      const authHeader = req.headers.authorization ?? '';

      // Path 1: Firebase login via ID token in Authorization header
      if (authHeader.startsWith('Bearer ')) {
        const idToken = authHeader.slice('Bearer '.length).trim();
        
        try {
          // Verify with Firebase Admin SDK
          const decoded = await admin.auth().verifyIdToken(idToken, true);
          const uid = decoded.uid;

          // Find or create user record tied to Firebase UID
          let user = await AuthService.findUserByFirebaseUid(uid);
          if (!user) {
            // Create user from Firebase token data
            const { user: newUser } = await AuthService.createUser({
              email: decoded.email || `user${uid.slice(0,8)}@firebase.local`,
              password: 'firebase-auth-user', // Placeholder, won't be used
              firstName: decoded.name?.split(' ')[0] || 'Firebase',
              lastName: decoded.name?.split(' ').slice(1).join(' ') || 'User',
              firebaseUid: uid,
            });
            user = newUser;
          }

          // Create session
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
      }

      // Path 2: Email/password login (custom auth)
      const validation = loginSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: 'Invalid credentials payload' });
      }

      const { email, password } = validation.data;
      
      // Find user
      const user = await AuthService.findUserByEmail(email.toLowerCase());
      if (!user || !user.passwordHash) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Check if account is active
      if (!user.isActive) {
        return res.status(401).json({ error: 'Account is deactivated' });
      }

      // Verify password
      const isValidPassword = await AuthService.verifyPassword(password, user.passwordHash);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Create session
      const { token: sessionJwt } = await AuthService.createSession(user.id);
      
      // Update last login
      await AuthService.updateLastLogin(user.id);

      return res.status(200).json({
        user: {
          id: user.id,
          email: user.email,
          displayName: `${user.firstName} ${user.lastName}`.trim(),
          photoUrl: null,
          roles: [],
          createdAt: user.createdAt,
          provider: 'password',
        },
        tokens: { sessionJwt },
        strategy: 'password',
      });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ error: 'Login failed' });
    }
  });

  // Verify email endpoint
  app.post('/api/auth/verify-email', async (req, res) => {
    try {
      const validation = verifyEmailSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({
          error: 'Invalid verification token',
        });
      }

      const { token } = validation.data;
      const user = await AuthService.verifyEmail(token);

      if (!user) {
        return res.status(400).json({
          error: 'Invalid or expired verification token',
        });
      }

      res.json({
        success: true,
        message: 'Email verified successfully! You can now sign in.',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isEmailVerified: user.isEmailVerified,
        },
      });
    } catch (error) {
      console.error('Email verification error:', error);
      res.status(500).json({
        error: 'Email verification failed. Please try again.',
      });
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

  // Forgot password endpoint
  app.post('/api/auth/forgot-password', async (req, res) => {
    try {
      const validation = forgotPasswordSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({
          error: 'Invalid email address',
        });
      }

      const { email } = validation.data;
      const resetToken = await AuthService.generatePasswordResetToken(email);

      if (resetToken) {
        try {
          const user = await AuthService.findUserByEmail(email);
          await sendPasswordResetEmail(email, resetToken, `${user!.firstName} ${user!.lastName}`);
        } catch (emailError) {
          console.error('Failed to send password reset email:', emailError);
        }
      }

      // Always return success to prevent email enumeration
      res.json({
        success: true,
        message: 'If an account with that email exists, we\'ve sent a password reset link.',
      });
    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({
        error: 'Failed to process password reset request',
      });
    }
  });

  // Reset password endpoint
  app.post('/api/auth/reset-password', async (req, res) => {
    try {
      const validation = resetPasswordSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({
          error: 'Validation failed',
          details: validation.error.flatten(),
        });
      }

      const { token, password } = validation.data;
      const user = await AuthService.resetPassword(token, password);

      if (!user) {
        return res.status(400).json({
          error: 'Invalid or expired reset token',
        });
      }

      res.json({
        success: true,
        message: 'Password reset successfully. You can now sign in with your new password.',
      });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({
        error: 'Password reset failed. Please try again.',
      });
    }
  });

  // Resend verification email endpoint
  app.post('/api/auth/resend-verification', async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({
          error: 'Email is required',
        });
      }

      const user = await AuthService.findUserByEmail(email);
      if (!user) {
        return res.status(404).json({
          error: 'No account found with this email',
        });
      }

      if (user.isEmailVerified) {
        return res.status(400).json({
          error: 'Email is already verified',
        });
      }

      // Generate new verification token
      const emailToken = AuthService.generateSecureToken();
      const emailTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      await AuthService.updateUser(user.id, {
        emailVerificationToken: emailToken,
        emailVerificationExpires: emailTokenExpiry,
      });

      try {
        await sendVerificationEmail(user.email, emailToken, `${user.firstName} ${user.lastName}`);
      } catch (emailError) {
        console.error('Failed to send verification email:', emailError);
        return res.status(500).json({
          error: 'Failed to send verification email',
        });
      }

      res.json({
        success: true,
        message: 'Verification email sent successfully',
      });
    } catch (error) {
      console.error('Resend verification error:', error);
      res.status(500).json({
        error: 'Failed to resend verification email',
      });
    }
  });
}