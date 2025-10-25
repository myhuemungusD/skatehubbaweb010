import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { getFirestore } from "firebase/firestore";
import { env } from '../config/env';

if (typeof window !== 'undefined') {
  window.fetch = window.fetch.bind(window);
}

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with explicit persistence
const auth = getAuth(app);

// Initialize Firestore
const db = getFirestore(app);

// Set explicit persistence to avoid Safari/iframe issues
if (typeof window !== 'undefined') {
  setPersistence(auth, browserLocalPersistence).catch(console.warn);
}

let appCheck: any = null;
if (env.PROD && typeof window !== 'undefined' && env.VITE_RECAPTCHA_SITE_KEY) {
  try {
    appCheck = initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(env.VITE_RECAPTCHA_SITE_KEY),
      isTokenAutoRefreshEnabled: true
    });
  } catch (error) {
    console.warn('App Check initialization failed:', error);
  }
}

let analytics: any = null;
if (typeof window !== 'undefined' && 
    window.location.protocol === "https:" && 
    !env.DEV) {
  isSupported().then((ok) => {
    if (ok) {
      analytics = getAnalytics(app);
      console.log('Firebase Analytics initialized');
    }
  }).catch(() => {});
}

export { app, auth, db, analytics };