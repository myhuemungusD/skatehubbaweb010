
import type { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';

/**
 * Rate limiter for email signup attempts
 * Limits to 5 signup attempts per 15 minutes per IP address
 * Helps prevent automated account creation and spam
 */
export const emailSignupLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 signup attempts per windowMs
  message: {
    error: 'Too many signup attempts from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter for authentication endpoints (login/register)
 * Limits to 10 authentication attempts per 15 minutes per IP address
 * Does not count successful logins, only failed attempts
 * Helps prevent brute force attacks
 */
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

/**
 * Strict rate limiter for password reset requests
 * Limits to 3 password reset attempts per hour per IP address
 * Prevents abuse of password reset functionality
 */
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Only 3 password reset requests per hour
  message: {
    error: 'Too many password reset attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * General API rate limiter for all endpoints
 * Limits to 100 requests per minute per IP address
 * Prevents API abuse and DDoS attacks
 */
export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: {
    error: 'Too many requests, please slow down.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Honeypot validation middleware to catch bots
 * 
 * Checks for a hidden form field named 'company' that humans won't fill but bots will.
 * On the frontend, include a hidden input: <input type="text" name="company" style="display:none" />
 * Legitimate users won't see or fill this field, but automated bots typically fill all fields.
 * 
 * @param req - Express request object with 'company' field in body
 * @param res - Express response object
 * @param next - Express next function
 */
export const validateHoneypot = (req: Request, res: Response, next: NextFunction) => {
  const { company } = req.body;
  
  // If honeypot field is filled, it's likely a bot
  if (company && company.trim() !== '') {
    return res.status(400).json({ error: 'Invalid submission' });
  }
  
  next();
};

/**
 * Email validation middleware
 * Validates email format and normalizes the email address
 * @param req - Express request object with email in body
 * @param res - Express response object
 * @param next - Express next function
 */
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
/**
 * User agent validation middleware
 * Rejects requests with suspicious or missing user agents
 * Helps block simple bot attacks and scrapers
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
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
/**
 * IP address logging middleware for security monitoring
 * Logs client IP addresses for suspicious activity tracking
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const logIPAddress = (req: Request, res: Response, next: NextFunction) => {
  // Get real IP address (accounting for proxies)
  const ip = req.headers['x-forwarded-for'] || 
             req.headers['x-real-ip'] || 
             req.connection.remoteAddress || 
             req.socket.remoteAddress;
  
  req.body.ipAddress = Array.isArray(ip) ? ip[0] : ip;
  next();
};
