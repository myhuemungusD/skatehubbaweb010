import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendEmailVerification, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

export async function registerUser(email: string, password: string) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const firebaseUser = userCredential.user;
  
  // Send email verification with Firebase action URL
  await sendEmailVerification(firebaseUser, {
    url: `${window.location.origin}/auth/verify`,
  });
  
  return firebaseUser;
}

export async function loginUser(email: string, password: string) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const firebaseUser = userCredential.user;
  
  // Check email verification
  if (!firebaseUser.emailVerified) {
    await signOut(auth);
    throw new Error("Please verify your email before logging in.");
  }
  
  // Get ID token and authenticate with backend
  const idToken = await firebaseUser.getIdToken();
  
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${idToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({}),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Login failed');
  }
  
  const result = await response.json();
  
  // Store session token
  if (result.tokens?.sessionJwt) {
    localStorage.setItem('sessionToken', result.tokens.sessionJwt);
  }
  
  return result;
}

export async function logoutUser() {
  await signOut(auth);
  localStorage.removeItem('sessionToken');
}

export function listenToAuth(callback: (user: any) => void) {
  return onAuthStateChanged(auth, callback);
}
