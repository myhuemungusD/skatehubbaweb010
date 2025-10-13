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
  } catch (error) {
    console.warn('Firebase Admin initialization failed:', error);
  }
}

export { admin };
