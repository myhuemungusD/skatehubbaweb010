// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

// Prevent Replit DevTools from interfering with fetch
if (typeof window !== "undefined") {
  window.fetch = window.fetch.bind(window);
}
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with explicit persistence
const auth = getAuth(app);

// Set explicit persistence to avoid Safari/iframe issues
if (typeof window !== "undefined") {
  setPersistence(auth, browserLocalPersistence).catch(console.warn);
}

// Add App Check with your site key (only in production)
let appCheck: any = null;
if (import.meta.env.PROD && typeof window !== "undefined") {
  try {
    appCheck = initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(
        "6Lf28bArAAAAAOP3vT4oL63nnC2xUYQ-UwHy2b_a",
      ),
      isTokenAutoRefreshEnabled: true,
    });
  } catch (error) {
    console.warn("App Check initialization failed:", error);
  }
}

// Only enable Analytics on HTTPS production hosts
let analytics: any = null;
if (
  typeof window !== "undefined" &&
  window.location.protocol === "https:" &&
  !import.meta.env.DEV
) {
  isSupported()
    .then((ok) => {
      if (ok) {
        analytics = getAnalytics(app);
        console.log("Firebase Analytics initialized");
      }
    })
    .catch(() => {});
}

export { app, auth, analytics };
