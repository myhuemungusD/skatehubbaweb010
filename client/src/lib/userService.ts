import { auth } from './firebase';
import type { User } from 'firebase/auth';

export interface UserProfile {
  id: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  createdAt: string;
}

export class UserService {
  static async getCurrentUser(): Promise<User | null> {
    return auth.currentUser;
  }

  static async getUserProfile(): Promise<UserProfile | null> {
    const user = auth.currentUser;
    if (!user) return null;

    return {
      id: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      createdAt: user.metadata.creationTime || new Date().toISOString(),
    };
  }

  static async updateProfile(updates: { displayName?: string; photoURL?: string }): Promise<void> {
    const user = auth.currentUser;
    if (!user) throw new Error('No authenticated user');

    const { updateProfile } = await import('firebase/auth');
    await updateProfile(user, updates);
  }

  static async deleteAccount(): Promise<void> {
    const user = auth.currentUser;
    if (!user) throw new Error('No authenticated user');

    const { deleteUser } = await import('firebase/auth');
    await deleteUser(user);
  }

  static async sendEmailVerification(): Promise<void> {
    const user = auth.currentUser;
    if (!user) throw new Error('No authenticated user');

    const { sendEmailVerification } = await import('firebase/auth');
    await sendEmailVerification(user);
  }
}
