
import express from 'express';
import { getFirestore, collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { emailSignupLimiter, validateHoneypot, validateEmail, validateUserAgent, logIPAddress } from '../middleware/security.js';

const router = express.Router();
const db = getFirestore();

// Secure email signup endpoint
router.post('/secure-signup', 
  emailSignupLimiter,
  validateUserAgent,
  validateHoneypot,
  validateEmail,
  logIPAddress,
  async (req, res) => {
    try {
      const { email, source = 'site', userAgent, ipAddress } = req.body;
      
      // Check for duplicate emails (optional - you might want to allow this)
      const existingSignups = query(
        collection(db, 'signups'),
        where('email', '==', email)
      );
      
      const duplicateCheck = await getDocs(existingSignups);
      if (!duplicateCheck.empty) {
        // Still return success to prevent email enumeration
        return res.json({ 
          success: true, 
          message: 'Thanks. Check your inbox.' 
        });
      }
      
      // Add to Firestore with additional security data
      await addDoc(collection(db, 'signups'), {
        email,
        source,
        createdAt: serverTimestamp(),
        userAgent,
        ipAddress,
        timestamp: Date.now(),
        verified: false
      });
      
      res.json({ 
        success: true, 
        message: 'Thanks. Check your inbox.' 
      });
      
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ 
        error: 'Something went wrong. Please try again.' 
      });
    }
  }
);

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
      const existingSubscriptions = query(
        collection(db, 'subscriptions'),
        where('email', '==', email.toLowerCase())
      );
      
      const duplicateCheck = await getDocs(existingSubscriptions);
      if (!duplicateCheck.empty) {
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
      
      await addDoc(collection(db, 'subscriptions'), {
        email: email.toLowerCase(),
        source,
        status: 'subscribed',
        createdAt: serverTimestamp(),
        expireAt: expireDate,
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
