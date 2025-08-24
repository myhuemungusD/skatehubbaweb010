// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Add App Check with your site key
const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider("6Lf28bArAAAAAOP3vT4oL63nnC2xUYQ-UwHy2b_a"),
  isTokenAutoRefreshEnabled: true
});

// Initialize Analytics only in production when supported
let analytics: any = null;
if (import.meta.env.PROD && typeof window !== 'undefined') {
  isSupported().then((ok) => ok && (analytics = getAnalytics(app))).catch(() => {});
}

export { app, analytics };