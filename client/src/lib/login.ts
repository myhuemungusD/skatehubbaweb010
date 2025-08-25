import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export async function loginWithFirebase(email: string, password: string) {
  const auth = getAuth();
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const idToken = await cred.user.getIdToken();

  // Create session using the new endpoint
  const response = await fetch('/api/auth/session', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${idToken}`
    },
    credentials: "include", // Important for cookies
  });

  if (!response.ok) {
    throw new Error('Session creation failed');
  }

  const data = await response.json();
  return data;
}

export async function logout() {
  const response = await fetch('/api/auth/logout', {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error('Logout failed');
  }

  return response.json();
}

export async function getCurrentUser() {
  const response = await fetch('/api/auth/me', {
    credentials: "include",
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}