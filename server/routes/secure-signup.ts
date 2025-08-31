
import express from 'express';
import { emailSignupLimiter, validateHoneypot, validateEmail, validateUserAgent, logIPAddress } from '../middleware/security.js';
import { admin } from '../admin.js';

const router = express.Router();
const db = admin.firestore();

// Secure subscription endpoint with TTL
router.post('/subscribe', 
  emailSignupLimiter,
  validateUserAgent,
  validateHoneypot,
  validateEmail,
  logIPAddress,
  async (req, res) => {
    try {
      const { email, source = 'landing', userAgent, ipAddress } = req.body;
      
      // Check for existing subscription
      const existingSubscriptions = await db.collection('subscriptions')
        .where('email', '==', email.toLowerCase())
        .limit(1)
        .get();
      
      if (!existingSubscriptions.empty) {
        // Return success to prevent email enumeration
        return res.json({ 
          success: true, 
          status: 'exists',
          message: 'You\'re already on our list!' 
        });
      }
      
      // Create subscription with 2-year TTL
      const expireDate = new Date();
      expireDate.setFullYear(expireDate.getFullYear() + 2);
      
      await db.collection('subscriptions').add({
        email: email.toLowerCase(),
        source,
        status: 'subscribed',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        expireAt: admin.firestore.Timestamp.fromDate(expireDate),
        userAgent,
        ipAddress,
        timestamp: Date.now(),
        verified: false
      });
      
      res.json({ 
        success: true, 
        status: 'created',
        message: 'Thanks for subscribing!' 
      });
      
    } catch (error) {
      console.error('Subscription error:', error);
      res.status(500).json({ 
        error: 'Something went wrong. Please try again.' 
      });
    }
  }
);

export default router;
