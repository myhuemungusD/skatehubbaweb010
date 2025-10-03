import { create } from "zustand";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";
import { ensureUserDoc, fetchUserDoc, UserProfile } from "../lib/userService";

interface UserStore {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  bootstrap: () => void;
  signInGoogle: () => Promise<void>;
  signInEmail: (email: string, password: string) => Promise<void>;
  signUpEmail: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUserDoc: () => Promise<void>;
  updateDisplayNameLocal: (displayName: string) => void;
  updatePhotoURLLocal: (photoURL: string) => void;
}

export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  firebaseUser: null,
  loading: true,

  bootstrap: () => {
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        set({ firebaseUser });
        const userProfile = await fetchUserDoc(firebaseUser.uid);
        set({ user: userProfile, loading: false });
      } else {
        set({ user: null, firebaseUser: null, loading: false });
      }
    });
  },

  signInGoogle: async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const { uid, email, displayName } = result.user;
    await ensureUserDoc(uid, email || "", displayName || "User");
    const userProfile = await fetchUserDoc(uid);
    set({ user: userProfile, firebaseUser: result.user });
  },

  signInEmail: async (email: string, password: string) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const userProfile = await fetchUserDoc(result.user.uid);
    set({ user: userProfile, firebaseUser: result.user });
  },

  signUpEmail: async (email: string, password: string, displayName: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await ensureUserDoc(result.user.uid, email, displayName);
    const userProfile = await fetchUserDoc(result.user.uid);
    set({ user: userProfile, firebaseUser: result.user });
  },

  signOut: async () => {
    await firebaseSignOut(auth);
    set({ user: null, firebaseUser: null });
  },

  refreshUserDoc: async () => {
    const { firebaseUser } = get();
    if (firebaseUser) {
      const userProfile = await fetchUserDoc(firebaseUser.uid);
      set({ user: userProfile });
    }
  },

  updateDisplayNameLocal: (displayName: string) => {
    const { user } = get();
    if (user) {
      set({ user: { ...user, displayName } });
    }
  },

  updatePhotoURLLocal: (photoURL: string) => {
    const { user } = get();
    if (user) {
      set({ user: { ...user, photoURL } });
    }
  },
}));
