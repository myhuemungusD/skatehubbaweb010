
import type { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';

// Rate limiting for email signups
export const emailSignupLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 signup attempts per windowMs
  message: {
    error: 'Too many signup attempts from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting for authentication endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 login attempts per window
  message: {
    error: 'Too many authentication attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful logins
});

// Strict rate limiting for password reset
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Only 3 password reset requests per hour
  message: {
    error: 'Too many password reset attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// General API rate limiting
export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: {
    error: 'Too many requests, please slow down.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Honeypot validation middleware
export const validateHoneypot = (req: Request, res: Response, next: NextFunction) => {
  const { company } = req.body;
  
  // If honeypot field is filled, it's likely a bot
  if (company && company.trim() !== '') {
    return res.status(400).json({ error: 'Invalid submission' });
  }
  
  next();
};

// Email validation middleware
export const validateEmail = (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email is required' });
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const trimmedEmail = email.trim();
  
  if (!emailRegex.test(trimmedEmail) || trimmedEmail.length < 3 || trimmedEmail.length > 254) {
    return res.status(400).json({ error: 'Please enter a valid email address' });
  }
  
  // Normalize email
  req.body.email = trimmedEmail.toLowerCase();
  next();
};

// User agent validation
export const validateUserAgent = (req: Request, res: Response, next: NextFunction) => {
  const userAgent = req.get('User-Agent');
  
  // Block requests without user agent (likely bots)
  if (!userAgent) {
    return res.status(400).json({ error: 'Invalid request' });
  }
  
  // Block common bot patterns
  const botPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /curl/i,
    /wget/i,
    /python/i
  ];
  
  if (botPatterns.some(pattern => pattern.test(userAgent))) {
    return res.status(400).json({ error: 'Automated requests not allowed' });
  }
  
  next();
};

// IP logging middleware
export const logIPAddress = (req: Request, res: Response, next: NextFunction) => {
  // Get real IP address (accounting for proxies)
  const ip = req.headers['x-forwarded-for'] || 
             req.headers['x-real-ip'] || 
             req.connection.remoteAddress || 
             req.socket.remoteAddress;
  
  req.body.ipAddress = Array.isArray(ip) ? ip[0] : ip;
  next();
};
