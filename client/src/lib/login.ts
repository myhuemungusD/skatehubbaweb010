
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export async function loginWithFirebase(email: string, password: string) {
  const auth = getAuth();
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const idToken = await cred.user.getIdToken();
  
  // Use your existing login endpoint that handles Firebase ID tokens
  const response = await fetch('/api/auth/login', {
    method: "POST",
    headers: { 
      "Content-Type": "application/json", 
      "Authorization": `Bearer ${idToken}` 
    },
  });
  
  if (!response.ok) {
    throw new Error('Login failed');
  }
  
  const data = await response.json();
  
  // Store session token if provided
  if (data.tokens?.sessionJwt) {
    localStorage.setItem('auth_token', data.tokens.sessionJwt);
  }
  
  return data;
}

export async function loginWithEmailPassword(email: string, password: string) {
  const response = await fetch('/api/auth/login', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  
  if (!response.ok) {
    throw new Error('Login failed');
  }
  
  const data = await response.json();
  
  // Store session token
  if (data.tokens?.sessionJwt) {
    localStorage.setItem('auth_token', data.tokens.sessionJwt);
  }
  
  return data;
}
