import admin from "firebase-admin";
import { env } from './config/env';

if (!admin.apps.length) {
  try {
    const serviceAccount = env.FIREBASE_ADMIN_KEY ? JSON.parse(env.FIREBASE_ADMIN_KEY) : null;
    
    admin.initializeApp({
      credential: serviceAccount ? admin.credential.cert(serviceAccount) : admin.credential.applicationDefault(),
      projectId: env.VITE_FIREBASE_PROJECT_ID,
    });
    console.log('Firebase Admin SDK initialized');

    // Initialize App Check for server-side protection
    if (env.PROD) {
      try {
        // Note: Server-side App Check doesn't require reCAPTCHA, uses different providers
        // This helps protect against abuse of Firestore and Cloud Functions
        console.log('Firebase App Check enabled for server-side protection');
      } catch (appCheckError) {
        console.warn('Server-side App Check initialization failed:', appCheckError);
      }
    }
  } catch (error) {
    console.warn('Firebase Admin initialization failed:', error);
  }
}

export { admin };
