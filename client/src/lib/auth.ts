import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendEmailVerification, onAuthStateChanged, signInWithPhoneNumber, RecaptchaVerifier, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "./firebase";

export async function registerUser(email: string, password: string) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const firebaseUser = userCredential.user;
  
  // Send email verification (Firebase will handle the redirect automatically)
  await sendEmailVerification(firebaseUser);
  
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
    credentials: 'include', // IMPORTANT: Send cookies with request
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Login failed');
  }
  
  const result = await response.json();
  
  // NOTE: Session token is now in HttpOnly cookie (not localStorage)
  // Server automatically sets cookie, no client-side storage needed
  
  return result;
}

export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);
  const firebaseUser = userCredential.user;
  
  // Get ID token and authenticate with backend
  const idToken = await firebaseUser.getIdToken();
  
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${idToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({}),
    credentials: 'include',
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Login failed');
  }
  
  const result = await response.json();
  return result;
}

export async function logoutUser() {
  // Call backend to clear HttpOnly cookie
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include', // IMPORTANT: Send cookies with request
    });
  } catch (error) {
    console.error('Backend logout failed:', error);
  }
  
  // Sign out from Firebase
  await signOut(auth);
  
  // NOTE: No localStorage to clear - using HttpOnly cookies now
}

export function listenToAuth(callback: (user: any) => void) {
  return onAuthStateChanged(auth, callback);
}

// Phone Authentication
export function setupRecaptcha(elementId: string): RecaptchaVerifier {
  return new RecaptchaVerifier(auth, elementId, {
    size: 'invisible',
    callback: () => {
      // reCAPTCHA solved - will proceed with phone auth
    }
  });
}

export async function sendPhoneVerification(phoneNumber: string, recaptchaVerifier: RecaptchaVerifier) {
  const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
  return confirmationResult;
}

export async function verifyPhoneCode(confirmationResult: any, code: string) {
  const userCredential = await confirmationResult.confirm(code);
  const firebaseUser = userCredential.user;
  
  // Get ID token and authenticate with backend
  const idToken = await firebaseUser.getIdToken();
  
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${idToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({}),
    credentials: 'include',
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Login failed');
  }
  
  const result = await response.json();
  return result;
}
