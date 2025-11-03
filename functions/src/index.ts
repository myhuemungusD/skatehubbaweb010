import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// Initialize Firebase Admin
admin.initializeApp();

/**
 * Example HTTP Cloud Function
 * Accessible at: https://<region>-<project-id>.cloudfunctions.net/helloWorld
 */
export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

/**
 * Example Firestore Trigger
 * Triggered when a new user document is created
 */
export const onUserCreated = functions.firestore
  .document("users/{userId}")
  .onCreate((snap, context) => {
    const newValue = snap.data();
    const userId = context.params.userId;

    functions.logger.info(`New user created: ${userId}`, newValue);

    // Add any custom logic here
    return null;
  });

/**
 * Example Scheduled Function
 * Runs every day at midnight
 */
export const dailyCleanup = functions.pubsub
  .schedule("0 0 * * *")
  .timeZone("America/New_York")
  .onRun((context) => {
    functions.logger.info("Daily cleanup running");
    // Add cleanup logic here
    return null;
  });
