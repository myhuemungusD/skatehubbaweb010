
import express from 'express';
import { getFirestore, collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { emailSignupLimiter, validateHoneypot, validateEmail, validateUserAgent, logIPAddress } from '../middleware/security';

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

export default router;
