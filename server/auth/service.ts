import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { db } from '../db.ts';
import { customUsers, authSessions } from '../../shared/schema.ts';
import { eq, and, gt } from 'drizzle-orm';
import type { CustomUser, InsertCustomUser, AuthSession } from '../../shared/schema.ts';
import { env } from '../config/env';

export class AuthService {
  private static readonly JWT_SECRET = env.JWT_SECRET;
  private static readonly SALT_ROUNDS = 12;
  private static readonly TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours
  private static readonly EMAIL_TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

  // Hash password
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  // Verify password
  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  // Generate JWT token
  static generateJWT(userId: string): string {
    return jwt.sign(
      { userId, type: 'access' },
      this.JWT_SECRET,
      { expiresIn: '24h' }
    );
  }

  // Verify JWT token
  static verifyJWT(token: string): { userId: string } | null {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as any;
      return { userId: decoded.userId };
    } catch (error) {
      return null;
    }
  }

  // Generate random token for email verification
  static generateSecureToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  // Create user
  static async createUser(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    firebaseUid?: string;
  }): Promise<{ user: CustomUser; emailToken: string }> {
    const passwordHash = userData.firebaseUid 
      ? 'firebase-auth-user' // Placeholder for Firebase users
      : await this.hashPassword(userData.password);
    const emailToken = this.generateSecureToken();
    const emailTokenExpiry = new Date(Date.now() + this.EMAIL_TOKEN_EXPIRY);

    const [user] = await db
      .insert(customUsers)
      .values({
        email: userData.email.toLowerCase().trim(),
        passwordHash,
        firstName: userData.firstName.trim(),
        lastName: userData.lastName.trim(),
        firebaseUid: userData.firebaseUid || null,
        emailVerificationToken: emailToken,
        emailVerificationExpires: emailTokenExpiry,
        isEmailVerified: !!userData.firebaseUid, // Firebase users are auto-verified
        isActive: true,
      })
      .returning();

    return { user, emailToken };
  }

  // Find user by email
  static async findUserByEmail(email: string): Promise<CustomUser | null> {
    const [user] = await db
      .select()
      .from(customUsers)
      .where(eq(customUsers.email, email.toLowerCase().trim()));
    
    return user || null;
  }

  // Find user by ID
  static async findUserById(id: string): Promise<CustomUser | null> {
    const [user] = await db
      .select()
      .from(customUsers)
      .where(eq(customUsers.id, id));
    
    return user || null;
  }

  // Find user by Firebase UID
  static async findUserByFirebaseUid(firebaseUid: string): Promise<CustomUser | null> {
    const [user] = await db
      .select()
      .from(customUsers)
      .where(eq(customUsers.firebaseUid, firebaseUid));
    
    return user || null;
  }

  // Verify email with token
  static async verifyEmail(token: string): Promise<CustomUser | null> {
    const [user] = await db
      .select()
      .from(customUsers)
      .where(
        and(
          eq(customUsers.emailVerificationToken, token),
          gt(customUsers.emailVerificationExpires, new Date())
        )
      );

    if (!user) return null;

    // Update user as verified
    const [updatedUser] = await db
      .update(customUsers)
      .set({
        isEmailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
        updatedAt: new Date(),
      })
      .where(eq(customUsers.id, user.id))
      .returning();

    return updatedUser;
  }

  // Verify email by user ID (for Firebase users)
  static async verifyEmailByUserId(userId: string): Promise<CustomUser | null> {
    const [updatedUser] = await db
      .update(customUsers)
      .set({
        isEmailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
        updatedAt: new Date(),
      })
      .where(eq(customUsers.id, userId))
      .returning();

    return updatedUser;
  }

  // Create session
  static async createSession(userId: string): Promise<{ token: string; session: AuthSession }> {
    const token = this.generateJWT(userId);
    const expiresAt = new Date(Date.now() + this.TOKEN_EXPIRY);

    const [session] = await db
      .insert(authSessions)
      .values({
        userId,
        token,
        expiresAt,
      })
      .returning();

    return { token, session };
  }

  // Validate session
  static async validateSession(token: string): Promise<CustomUser | null> {
    // First verify JWT
    const decoded = this.verifyJWT(token);
    if (!decoded) return null;

    // Check if session exists and is valid
    const [session] = await db
      .select()
      .from(authSessions)
      .where(
        and(
          eq(authSessions.token, token),
          gt(authSessions.expiresAt, new Date())
        )
      );

    if (!session) return null;

    // Get user
    return this.findUserById(session.userId);
  }

  // Delete session (logout)
  static async deleteSession(token: string): Promise<void> {
    await db
      .delete(authSessions)
      .where(eq(authSessions.token, token));
  }

  // Update last login
  static async updateLastLogin(userId: string): Promise<void> {
    await db
      .update(customUsers)
      .set({
        lastLoginAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(customUsers.id, userId));
  }

  // Generate password reset token
  static async generatePasswordResetToken(email: string): Promise<string | null> {
    const user = await this.findUserByEmail(email);
    if (!user || !user.isEmailVerified) return null;

    const resetToken = this.generateSecureToken();
    const resetExpiry = new Date(Date.now() + this.EMAIL_TOKEN_EXPIRY);

    await db
      .update(customUsers)
      .set({
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetExpiry,
        updatedAt: new Date(),
      })
      .where(eq(customUsers.id, user.id));

    return resetToken;
  }

  // Reset password with token
  static async resetPassword(token: string, newPassword: string): Promise<CustomUser | null> {
    const [user] = await db
      .select()
      .from(customUsers)
      .where(
        and(
          eq(customUsers.resetPasswordToken, token),
          gt(customUsers.resetPasswordExpires, new Date())
        )
      );

    if (!user) return null;

    const passwordHash = await this.hashPassword(newPassword);

    const [updatedUser] = await db
      .update(customUsers)
      .set({
        passwordHash,
        resetPasswordToken: null,
        resetPasswordExpires: null,
        updatedAt: new Date(),
      })
      .where(eq(customUsers.id, user.id))
      .returning();

    return updatedUser;
  }

  // Update user helper method
  static async updateUser(userId: string, updates: Partial<InsertCustomUser>): Promise<CustomUser | null> {
    const [updatedUser] = await db
      .update(customUsers)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(customUsers.id, userId))
      .returning();

    return updatedUser || null;
  }
}