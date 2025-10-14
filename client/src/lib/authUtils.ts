import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, signOut, onAuthStateChanged, User } from "firebase/auth";
import { app } from "./firebase";

const auth = getAuth(app);

export async function registerUser(email: string, password: string) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await sendEmailVerification(userCredential.user, {
    url: `${window.location.origin}/auth/verified`
  });
  return userCredential.user;
}

export async function loginUser(email: string, password: string) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  if (!userCredential.user.emailVerified) {
    await signOut(auth);
    throw new Error("Please verify your email before logging in.");
  }
  return userCredential.user;
}

export async function logoutUser() {
  await signOut(auth);
}

export function listenToAuthChanges(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
