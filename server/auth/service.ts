import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { db } from '../db.ts';
import { customUsers, authSessions } from '../../shared/schema.ts';
import { eq, and, gt } from 'drizzle-orm';
import type { CustomUser, InsertCustomUser, AuthSession } from '../../shared/schema.ts';
import { env } from '../config/env';

/**
 * Authentication service for SkateHubba
 * Handles user registration, login, password management, and session management
 * Supports both Firebase and traditional email/password authentication
 */
export class AuthService {
  private static readonly JWT_SECRET = env.JWT_SECRET;
  private static readonly SALT_ROUNDS = 12;
  private static readonly TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours
  private static readonly EMAIL_TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

  /**
   * Hash a plaintext password using bcrypt
   * 
   * Uses bcrypt with 12 salt rounds for secure password hashing.
   * Bcrypt is chosen for its adaptive nature - it remains secure as hardware
   * improves by allowing the number of rounds to be increased over time.
   * 
   * @param password - The plaintext password to hash
   * @returns Promise resolving to the hashed password
   */
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  /**
   * Verify a plaintext password against a bcrypt hash
   * @param password - The plaintext password to verify
   * @param hash - The bcrypt hash to compare against
   * @returns Promise resolving to true if password matches, false otherwise
   */
  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Generate a JWT token for a user
   * @param userId - The user's unique identifier
   * @returns JWT token string valid for 24 hours
   */
  static generateJWT(userId: string): string {
    return jwt.sign(
      { userId, type: 'access' },
      this.JWT_SECRET,
      { expiresIn: '24h' }
    );
  }

  /**
   * Verify and decode a JWT token
   * @param token - The JWT token to verify
   * @returns Object containing userId if valid, null if invalid or expired
   */
  static verifyJWT(token: string): { userId: string } | null {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as any;
      return { userId: decoded.userId };
    } catch (error) {
      return null;
    }
  }

  /**
   * Generate a secure random token for email verification
   * @returns 64-character hexadecimal token
   */
  static generateSecureToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Create a new user account
   * @param userData - User registration data
   * @param userData.email - User's email address
   * @param userData.password - User's password (plain text, will be hashed)
   * @param userData.firstName - User's first name
   * @param userData.lastName - User's last name
   * @param userData.firebaseUid - Optional Firebase UID for Firebase-authenticated users
   * @returns Promise resolving to created user and email verification token
   */
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

  /**
   * Find a user by their email address
   * @param email - Email address to search for (case-insensitive)
   * @returns Promise resolving to user object if found, null otherwise
   */
  static async findUserByEmail(email: string): Promise<CustomUser | null> {
    const [user] = await db
      .select()
      .from(customUsers)
      .where(eq(customUsers.email, email.toLowerCase().trim()));
    
    return user || null;
  }

  /**
   * Find a user by their unique ID
   * @param id - User ID to search for
   * @returns Promise resolving to user object if found, null otherwise
   */
  static async findUserById(id: string): Promise<CustomUser | null> {
    const [user] = await db
      .select()
      .from(customUsers)
      .where(eq(customUsers.id, id));
    
    return user || null;
  }

  /**
   * Find a user by their Firebase UID
   * @param firebaseUid - Firebase authentication UID
   * @returns Promise resolving to user object if found, null otherwise
   */
  static async findUserByFirebaseUid(firebaseUid: string): Promise<CustomUser | null> {
    const [user] = await db
      .select()
      .from(customUsers)
      .where(eq(customUsers.firebaseUid, firebaseUid));
    
    return user || null;
  }

  /**
   * Verify a user's email address using verification token
   * @param token - Email verification token sent to user
   * @returns Promise resolving to updated user if token is valid, null otherwise
   */
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

  /**
   * Verify a user's email by their user ID (for Firebase users)
   * @param userId - User ID to verify
   * @returns Promise resolving to updated user if found, null otherwise
   */
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

  /**
   * Create a new authentication session for a user
   * @param userId - User ID to create session for
   * @returns Promise resolving to JWT token and session record
   */
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

  /**
   * Validate a session token and retrieve associated user
   * @param token - Session JWT token to validate
   * @returns Promise resolving to user if session is valid, null otherwise
   */
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

  /**
   * Delete a session (logout)
   * @param token - Session token to delete
   * @returns Promise that resolves when session is deleted
   */
  static async deleteSession(token: string): Promise<void> {
    await db
      .delete(authSessions)
      .where(eq(authSessions.token, token));
  }

  /**
   * Update the last login timestamp for a user
   * @param userId - User ID to update
   * @returns Promise that resolves when update is complete
   */
  static async updateLastLogin(userId: string): Promise<void> {
    await db
      .update(customUsers)
      .set({
        lastLoginAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(customUsers.id, userId));
  }

  /**
   * Generate a password reset token for a user
   * @param email - Email address of user requesting password reset
   * @returns Promise resolving to reset token if user exists and is verified, null otherwise
   */
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

  /**
   * Reset a user's password using a reset token
   * @param token - Password reset token
   * @param newPassword - New password (plain text, will be hashed)
   * @returns Promise resolving to updated user if token is valid, null otherwise
   */
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

  /**
   * Update user information
   * @param userId - User ID to update
   * @param updates - Partial user data to update
   * @returns Promise resolving to updated user if found, null otherwise
   */
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