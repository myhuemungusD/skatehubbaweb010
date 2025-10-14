import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "./firebase";

export async function registerUser(email: string, password: string) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const firebaseUser = userCredential.user;
  
  // Get ID token and register with backend
  const idToken = await firebaseUser.getIdToken();
  
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
    body: JSON.stringify({}),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Registration failed');
  }
  
  const result = await response.json();
  
  // Store session token
  if (result.tokens?.sessionJwt) {
    localStorage.setItem('sessionToken', result.tokens.sessionJwt);
  }
  
  return result;
}

export async function loginUser(email: string, password: string) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
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
