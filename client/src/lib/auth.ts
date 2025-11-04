import type { User } from "firebase/auth";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  onAuthStateChanged,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously,
  updateProfile,
  type ConfirmationResult
} from "firebase/auth";
import { auth } from "./firebase";

type RegistrationProfile = {
  firstName?: string;
  lastName?: string;
};

type BackendProfile = RegistrationProfile & {
  isRegistration?: boolean;
};

function extractNameParts(displayName?: string) {
  if (!displayName) {
    return { firstName: undefined, lastName: undefined };
  }

  const parts = displayName.trim().split(/\s+/);
  if (parts.length === 0) {
    return { firstName: undefined, lastName: undefined };
  }

  const [firstName, ...rest] = parts;
  const lastName = rest.length > 0 ? rest.join(" ") : undefined;
  return { firstName, lastName };
}

async function authenticateWithBackend(firebaseUser: User, profile: BackendProfile = {}) {
  const idToken = await firebaseUser.getIdToken();
  const derivedNames = extractNameParts(firebaseUser.displayName ?? undefined);

  const payload: Record<string, unknown> = {};

  const firstName = profile.firstName ?? derivedNames.firstName;
  if (firstName) {
    payload.firstName = firstName;
  }

  const lastName = profile.lastName ?? derivedNames.lastName;
  if (lastName) {
    payload.lastName = lastName;
  }

  if (typeof profile.isRegistration === "boolean") {
    payload.isRegistration = profile.isRegistration;
  }

  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload),
    credentials: "include"
  });

  if (!response.ok) {
    let errorMessage = "Login failed";
    try {
      const errorData = await response.json();
      if (typeof errorData?.error === "string" && errorData.error.trim().length > 0) {
        errorMessage = errorData.error;
      }
    } catch (parseError) {
      // ignore JSON parse errors - we'll use default message
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

export async function registerUser(email: string, password: string, profile: RegistrationProfile = {}) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const firebaseUser = userCredential.user;

  const displayName = `${profile.firstName ?? ""} ${profile.lastName ?? ""}`.trim();
  if (displayName.length > 0) {
    await updateProfile(firebaseUser, { displayName });
  }

  await sendEmailVerification(firebaseUser);

  return firebaseUser;
}

export async function loginUser(email: string, password: string) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const firebaseUser = userCredential.user;

  if (!firebaseUser.emailVerified) {
    await signOut(auth);
    throw new Error("Please verify your email before logging in.");
  }

  return authenticateWithBackend(firebaseUser);
}

export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  const userCredential = await signInWithPopup(auth, provider);
  const firebaseUser = userCredential.user;

  return authenticateWithBackend(firebaseUser);
}

export async function loginAnonymously() {
  const userCredential = await signInAnonymously(auth);
  const firebaseUser = userCredential.user;

  return authenticateWithBackend(firebaseUser);
}

export async function logoutUser() {
  try {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include"
    });
  } catch (error) {
    console.error("Backend logout failed:", error);
  }

  await signOut(auth);
}

export function listenToAuth(callback: (user: any) => void) {
  return onAuthStateChanged(auth, callback);
}

// Phone Authentication
let activeRecaptcha: RecaptchaVerifier | null = null;

export async function setupRecaptcha(elementId: string): Promise<RecaptchaVerifier> {
  if (typeof window === "undefined") {
    throw new Error("reCAPTCHA can only be initialized in the browser.");
  }

  if (activeRecaptcha) {
    await activeRecaptcha.clear();
    activeRecaptcha = null;
  }

  activeRecaptcha = new RecaptchaVerifier(auth, elementId, {
    size: "invisible",
    callback: () => {
      // reCAPTCHA solved - Firebase will continue with phone auth
    }
  });

  await activeRecaptcha.render();
  return activeRecaptcha;
}

export async function sendPhoneVerification(phoneNumber: string, recaptchaVerifier: RecaptchaVerifier) {
  const normalizedPhone = phoneNumber.replace(/[\s-]/g, "").trim();

  if (!normalizedPhone.startsWith("+")) {
    throw new Error("Enter the phone number in international format, e.g. +1 555 555 5555.");
  }

  return signInWithPhoneNumber(auth, normalizedPhone, recaptchaVerifier);
}

export async function verifyPhoneCode(confirmationResult: ConfirmationResult, code: string) {
  const sanitizedCode = code.trim();
  if (!sanitizedCode) {
    throw new Error("Enter the verification code sent to your phone.");
  }

  const userCredential = await confirmationResult.confirm(sanitizedCode);
  const firebaseUser = userCredential.user;

  return authenticateWithBackend(firebaseUser);
}
