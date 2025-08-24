// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD6kLt4GKV4adX-oQ3m_aXIpL6GXBP0xZw",
  authDomain: "sk8hub-d7806.firebaseapp.com",
  projectId: "sk8hub-d7806",
  storageBucket: "sk8hub-d7806.firebasestorage.app",
  messagingSenderId: "665573979824",
  appId: "1:665573979824:web:731aaae46daea5efee2d75",
  measurementId: "G-7XVNF1LHZW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics only on client side and when supported
let analytics: any = null;
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.warn('Analytics not available:', error);
  }
}

export { app, analytics };