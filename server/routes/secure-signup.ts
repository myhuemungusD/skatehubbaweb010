import express from "express";
import admin from "firebase-admin"; // Import the Admin SDK
import {
  emailSignupLimiter,
  validateHoneypot,
  validateEmail,
  validateUserAgent,
  logIPAddress,
} from "../middleware/security";

const router = express.Router();

// Initialize Firebase Admin SDK if not already initialized
// This is a common pattern to ensure it's only initialized once.
if (!admin.apps.length) {
  admin.initializeApp();
}

// Get Firestore instance (Admin SDK)
const db = admin.firestore();

// Secure email signup endpoint
router.post(
  "/secure-signup",
  emailSignupLimiter,
  validateUserAgent,
  validateHoneypot,
  validateEmail,
  logIPAddress,
  async (req, res) => {
    try {
      const { email, source = "site", userAgent, ipAddress } = req.body;

      // Check for duplicate emails (optional - you might want to allow this)
      const existingSignups = db.collection("signups").where("email", "==", email);

      const duplicateCheck = await existingSignups.get();
      if (!duplicateCheck.empty) {
        // Still return success to prevent email enumeration
        return res.json({
          success: true,
          message: "Thanks. Check your inbox.",
        });
      }

      // Add to Firestore with additional security data
      await db.collection("signups").add({
        email,
        source,
        createdAt: admin.firestore.FieldValue.serverTimestamp(), // Use Admin SDK's serverTimestamp
        userAgent,
        ipAddress,
        timestamp: Date.now(),
        verified: false,
      });

      res.json({
        success: true,
        message: "Thanks. Check your inbox.",
      });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({
        error: "Something went wrong. Please try again.",
      });
    }
  },
);

export default router;