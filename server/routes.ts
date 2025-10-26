import express, { type Request, type Response, type NextFunction } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { subscribeLimit } from "./index";
import { Resend } from "resend";
import { db, eq } from "./db";
import { users, insertUserSchema, selectUserSchema, tutorialSteps, userProgress } from "../shared/schema";
import { hashPassword, comparePassword } from "./storage";
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { emailSignupLimiter, validateHoneypot, validateEmail, validateUserAgent, logIPAddress } from './middleware/security.ts';
import { admin } from './admin.ts';
import { env } from './config/env';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;
import Stripe from "stripe";
import { storage } from "./storage";
import { 
  insertUserProgressSchema, 
  updateUserProgressSchema,
  NewSubscriberInput
} from "../shared/schema.ts";
import crypto from "crypto";
import validator from "validator";
import { sendSubscriberNotification } from "./email";
import { setupAuthRoutes } from "./auth/routes.ts";
import OpenAI from "openai";
import { initializeDatabase } from "./db";

const stripe = env.STRIPE_SECRET_KEY ? new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
}) : null;

const openai = env.OPENAI_API_KEY ? new OpenAI({ apiKey: env.OPENAI_API_KEY }) : null;

// Security validation functions
const sanitizeString = (str: string): string => {
  // Remove potential XSS vectors
  const sanitized = validator.escape(str.trim());
  // Remove SQL injection patterns
  return sanitized.replace(/['\\';|*%<>{}[\]()]/g, '');
};

const validateId = (id: string): boolean => {
  return validator.isInt(id, { min: 1 }) && validator.isLength(id, { max: 20 });
};



const validateUserId = (userId: string): boolean => {
  // Validate Replit user ID format
  return validator.isLength(userId, { min: 1, max: 100 }) && 
         validator.matches(userId, /^[a-zA-Z0-9_-]+$/);
};

// Per-user rate limiting store
const userRateLimits = new Map();

const createUserRateLimit = (userId: string, maxRequests: number, windowMs: number) => {
  const now = Date.now();
  const userKey = `${userId}_${Math.floor(now / windowMs)}`;

  if (!userRateLimits.has(userKey)) {
    userRateLimits.set(userKey, 0);
    // Clean up old entries
    setTimeout(() => userRateLimits.delete(userKey), windowMs);
  }

  const count = userRateLimits.get(userKey) + 1;
  userRateLimits.set(userKey, count);

  return count <= maxRequests;
};

// Admin API key middleware with timing attack protection
const requireApiKey = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'] || req.headers['authorization']?.replace('Bearer ', '');

  if (!env.ADMIN_API_KEY) {
    return res.status(500).json({ error: "Admin API key not configured" });
  }

  if (!apiKey || apiKey.length !== env.ADMIN_API_KEY.length) {
    return res.status(401).json({ error: "Invalid or missing API key" });
  }

  const providedKey = Buffer.from(apiKey, 'utf8');
  const validKey = Buffer.from(env.ADMIN_API_KEY, 'utf8');

  if (!crypto.timingSafeEqual(providedKey, validKey)) {
    return res.status(401).json({ error: "Invalid or missing API key" });
  }

  next();
};

// Enhanced user validation middleware
const validateUserAccess = (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  const authenticatedUserId = req.user?.claims?.sub;

  if (!authenticatedUserId) {
    return res.status(401).json({ error: "Authentication required" });
  }

  if (!validateUserId(userId)) {
    return res.status(400).json({ error: "Invalid user ID format" });
  }

  // Users can only access their own data (except admins)
  if (userId !== authenticatedUserId && !req.user?.isAdmin) {
    return res.status(403).json({ error: "Access denied" });
  }

  // Check per-user rate limits
  if (!createUserRateLimit(authenticatedUserId, 100, 60000)) { // 100 requests per minute
    return res.status(429).json({ error: "Rate limit exceeded for user" });
  }

  next();
};

// Remove old authentication - now using Replit Auth

// Request validation middleware
const validateRequest = (schema: z.ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ 
        error: "Invalid request data", 
        details: result.error.errors 
      });
    }
    req.validatedBody = result.data;
    next();
  } catch (error) {
    res.status(400).json({ error: "Request validation failed" });
  }
};

export async function registerRoutes(app: express.Application): Promise<Server> {
  // Initialize database on startup
  await initializeDatabase();

  // Firebase Authentication Routes
  setupAuthRoutes(app);

  app.get('/api/health', (req: Request, res: Response) => {
    res.status(200).json({
      status: 'ok',
      env: env.NODE_ENV,
      time: new Date().toISOString()
    });
  });

  // Removed /api/auth/user - now using Firebase-only authentication

  // Tutorial Steps Routes
  app.get("/api/tutorial/steps", async (req: Request, res: Response) => {
    try {
      const steps = await storage.getAllTutorialSteps();
      res.json(steps);
    } catch (error) {
      console.error("Failed to get tutorial steps:", error);
      res.status(500).json({ error: "Failed to retrieve tutorial steps" });
    }
  });

  app.get("/api/tutorial/steps/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!validateId(id)) {
        return res.status(400).json({ error: "Invalid step ID format" });
      }

      const stepId = parseInt(id);
      const step = await storage.getTutorialStep(stepId);
      if (!step) {
        return res.status(404).json({ error: "Tutorial step not found" });
      }

      res.json(step);
    } catch (error) {
      console.error("Failed to get tutorial step:", error);
      res.status(500).json({ error: "Failed to retrieve tutorial step" });
    }
  });

  // User Progress Routes
  app.get("/api/users/:userId/progress", async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const progress = await storage.getUserProgress(userId);
      res.json(progress);
    } catch (error) {
      console.error("Failed to get user progress:", error);
      res.status(500).json({ error: "Failed to retrieve user progress" });
    }
  });

  app.get("/api/users/:userId/progress/:stepId", async (req, res) => {
    try {
      const { userId } = req.params;
      const stepId = parseInt(req.params.stepId);

      if (isNaN(stepId)) {
        return res.status(400).json({ error: "Invalid step ID" });
      }

      const progress = await storage.getUserStepProgress(userId, stepId);
      if (!progress) {
        return res.status(404).json({ error: "Progress not found" });
      }

      res.json(progress);
    } catch (error) {
      console.error("Failed to get user step progress:", error);
      res.status(500).json({ error: "Failed to retrieve user step progress" });
    }
  });

  app.post("/api/users/:userId/progress", async (req, res) => {
    try {
      const { userId } = req.params;

      const progressData = insertUserProgressSchema.parse({
        ...req.body,
        userId
      });

      const progress = await storage.createUserProgress(progressData);
      res.status(201).json(progress);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid progress data", details: error.errors });
      }
      console.error("Failed to create user progress:", error);
      res.status(500).json({ error: "Failed to create user progress" });
    }
  });

  app.patch("/api/users/:userId/progress/:stepId", async (req, res) => {
    try {
      const { userId } = req.params;
      const stepId = parseInt(req.params.stepId);

      if (isNaN(stepId)) {
        return res.status(400).json({ error: "Invalid step ID" });
      }

      const updates = updateUserProgressSchema.parse(req.body);
      const progress = await storage.updateUserProgress(userId, stepId, updates);

      if (!progress) {
        return res.status(404).json({ error: "Progress not found" });
      }

      res.json(progress);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid update data", details: error.errors });
      }
      console.error("Failed to update user progress:", error);
      res.status(500).json({ error: "Failed to update user progress" });
    }
  });

  // User Onboarding Routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json(user);
    } catch (error) {
      console.error("Failed to get user:", error);
      res.status(500).json({ error: "Failed to retrieve user" });
    }
  });

  app.patch("/api/users/:id/onboarding", async (req, res) => {
    try {
      const { id } = req.params;

      const { completed, currentStep } = req.body;
      if (typeof completed !== "boolean") {
        return res.status(400).json({ error: "Invalid completed status" });
      }

      const user = await storage.updateUserOnboardingStatus(id, completed, currentStep);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json(user);
    } catch (error) {
      console.error("Failed to update user onboarding:", error);
      res.status(500).json({ error: "Failed to update user onboarding" });
    }
  });

  // Stripe payment routes with enhanced security
  app.post("/api/create-payment-intent", async (req: Request, res: Response) => {
    try {
      const clientIP = req.ip || req.connection.remoteAddress;
      const userAgent = req.get('User-Agent');

      const { amount, currency = "usd", description = "SkateHubba Donation" } = req.body;

      // Enhanced amount validation
      if (!amount || typeof amount !== 'number' || amount < 0.50 || amount > 10000 || !Number.isFinite(amount)) {
        return res.status(400).json({ error: "Amount must be between $0.50 and $10,000" });
      }

      // Check for suspicious patterns
      if (amount === Math.floor(amount) && amount > 1000) {
        console.warn(`Large round number payment attempt: ${amount} from IP: ${clientIP}`);
      }

      // Validate currency
      const allowedCurrencies = ['usd', 'eur', 'gbp', 'cad', 'aud'];
      if (!allowedCurrencies.includes(currency.toLowerCase())) {
        return res.status(400).json({ error: "Unsupported currency" });
      }

      // Sanitize description
      const sanitizedDescription = sanitizeString(description);
      if (sanitizedDescription.length > 100) {
        return res.status(400).json({ error: "Description too long" });
      }

      // Generate idempotency key for payment safety
      const idempotencyKey = crypto.randomUUID();

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toLowerCase(),
        description: sanitizedDescription,
        automatic_payment_methods: {
          enabled: true,
        },
        payment_method_types: ['card', 'apple_pay', 'google_pay', 'link'],
        metadata: {
          source: 'skatehubba_website',
          timestamp: new Date().toISOString()
        }
      }, {
        idempotencyKey
      });

      res.json({ 
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      });
    } catch (error: any) {
      console.error("Payment intent creation failed:", error);
      res.status(500).json({ 
        error: "Failed to create payment intent"
      });
    }
  });

  // Get payment status
  app.get("/api/payment-intent/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const paymentIntent = await stripe.paymentIntents.retrieve(id);

      res.json({
        status: paymentIntent.status,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        description: paymentIntent.description
      });
    } catch (error: any) {
      console.error("Failed to retrieve payment intent:", error);
      res.status(500).json({ 
        error: "Failed to retrieve payment intent",
        details: error.message 
      });
    }
  });

  // Record donation when payment succeeds
  app.post("/api/record-donation", async (req, res) => {
    try {
      const { paymentIntentId, firstName } = req.body;

      if (!paymentIntentId || !firstName) {
        return res.status(400).json({ error: "Payment intent ID and first name are required" });
      }

      // Verify payment with Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

      if (paymentIntent.status !== "succeeded") {
        return res.status(400).json({ error: "Payment not successful" });
      }

      // Record the donation
      const donation = await storage.createDonation({
        firstName: sanitizeString(firstName),
        amount: paymentIntent.amount,
        paymentIntentId,
        status: "succeeded"
      });

      res.json({ message: "Donation recorded successfully", donationId: donation.id });
    } catch (error) {
      console.error("Failed to record donation:", error);
      res.status(500).json({ error: "Failed to record donation" });
    }
  });

  // Get recent donors (first names only)
  app.get("/api/recent-donors", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      if (limit > 50) {
        return res.status(400).json({ error: "Limit cannot exceed 50" });
      }

      const donors = await storage.getRecentDonors(limit);
      res.json(donors);
    } catch (error) {
      console.error("Failed to get recent donors:", error);
      res.status(500).json({ error: "Failed to retrieve recent donors" });
    }
  });

  app.post("/api/subscribe", async (req, res) => {
    const parsed = NewSubscriberInput.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ ok: false, error: parsed.error.flatten() });

    const { email, firstName } = parsed.data;

    try {
      const existing = await storage.getSubscriber(email);
      if (existing) {
        // idempotent response for existing
        return res.status(200).json({ 
          ok: true, 
          status: "exists", 
          msg: "You're already on the beta list! We'll notify you when it's ready." 
        });
      }

      const created = await storage.createSubscriber({
        email,
        firstName: firstName ?? null,
        isActive: true, // service-level default
      });

      await sendSubscriberNotification(email, firstName || "");

      return res.status(201).json({ 
        ok: true, 
        status: "created", 
        id: created.id,
        msg: "Welcome to the beta list! Check your email for confirmation." 
      });
    } catch (error) {
      console.error("Subscription error:", error);
      return res.status(500).json({ 
        ok: false, 
        error: "Failed to process subscription. Please try again." 
      });
    }
  });

  // Get all subscribers (admin only - requires API key)
  app.get("/api/subscribers", requireApiKey, async (req, res) => {
    try {
      const subscribers = await storage.getSubscribers();
      res.json(subscribers);
    } catch (error) {
      console.error("Failed to get subscribers:", error);
      res.status(500).json({ error: "Failed to retrieve subscribers" });
    }
  });

  // OpenAI Assistant route (legacy)
  app.post("/api/assistant", async (req, res) => {
    try {
      const { persona = "filmer", messages = [] } = req.body || {};

      const system =
        persona === "editor"
          ? "You are 'The Editor'—a blunt, no-nonsense skate mag lifer. Keep answers short, direct, and occasionally spicy, but helpful. Avoid profanity. Never claim affiliation with any real person or brand."
          : "You are 'The Filmer'—a hype filmer buddy. Encouraging, core skate slang, keeps it positive. Be concise and helpful. Never claim affiliation with any real person or brand.";

      const resp = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "system", content: system }, ...messages].slice(-12),
        temperature: 0.7,
        max_tokens: 300
      });

      const answer = resp.choices?.[0]?.message || { role: "assistant", content: "All good!" };
      res.json({ ok: true, reply: answer });
    } catch (e) {
      console.error(e);
      res.status(500).json({ ok: false, error: "Assistant error" });
    }
  });

  // Beagle AI Chat route
  app.post("/api/ai/chat", async (req, res) => {
    try {
      if (!openai) {
        return res.status(503).json({ 
          ok: false, 
          error: "AI chat is currently unavailable" 
        });
      }

      const { messages = [] } = req.body || {};

      const systemPrompt = `You are Beagle, an enthusiastic AI skate buddy for SkateHubba™. 
You're knowledgeable about skateboarding culture, tricks, spots, and the SkateHubba app features.
- Keep responses short, friendly, and use skate slang naturally
- Be encouraging and positive
- Help users with app features (check-ins, AR tricks, leaderboards, etc.)
- Share skateboarding tips and trick advice
- Never claim to be a real person or affiliated with real brands
- Use emojis occasionally to keep it fun 🛹
- Keep responses under 150 words`;

      const resp = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.slice(-12) // Last 12 messages for context
        ],
        temperature: 0.8,
        max_tokens: 200
      });

      const answer = resp.choices?.[0]?.message || { 
        role: "assistant", 
        content: "Hey! I'm here to help with all things skateboarding! 🛹" 
      };
      
      res.json({ ok: true, reply: answer });
    } catch (e) {
      console.error("AI Chat error:", e);
      res.status(500).json({ ok: false, error: "Chat error - try again in a moment!" });
    }
  });

  // Create demo user for testing (temporary)
  app.post("/api/demo-user", async (req, res) => {
    try {
      const demoUser = await storage.upsertUser({
        id: "demo_skater_" + Date.now(),
        firstName: "Demo",
        lastName: "User"
      });

      // Return user data
      const safeUser = demoUser;
      res.status(201).json(safeUser);
    } catch (error) {
      console.error("Failed to create demo user:", error);
      res.status(500).json({ error: "Failed to create demo user" });
    }
  });

  // Spot Check-In with Geo-Verification
  app.post("/api/spots/check-in", async (req, res) => {
    try {
      const { spotId, userId, latitude, longitude } = req.body;

      if (!spotId || !userId || latitude === undefined || longitude === undefined) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields: spotId, userId, latitude, longitude"
        });
      }

      // Mock spot data (in production this would come from database/Firestore)
      const mockSpots: Record<string, { lat: number; lng: number; name: string }> = {
        'spot-1': { lat: 40.7128, lng: -74.0060, name: 'Downtown Rails' },
        'spot-2': { lat: 40.7589, lng: -73.9851, name: 'City Plaza Stairs' },
        'spot-3': { lat: 40.7829, lng: -73.9654, name: 'Riverside Park' },
        'spot-4': { lat: 40.7489, lng: -73.9680, name: 'Industrial Ledges' },
      };

      const spot = mockSpots[spotId];
      if (!spot) {
        return res.status(404).json({
          success: false,
          message: "Spot not found"
        });
      }

      // Calculate distance using Haversine formula
      const R = 6371e3; // Earth radius in meters
      const φ1 = (latitude * Math.PI) / 180;
      const φ2 = (spot.lat * Math.PI) / 180;
      const Δφ = ((spot.lat - latitude) * Math.PI) / 180;
      const Δλ = ((spot.lng - longitude) * Math.PI) / 180;

      const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c; // Distance in meters

      const MAX_CHECKIN_DISTANCE = 30; // 30 meters as per roadmap

      if (distance > MAX_CHECKIN_DISTANCE) {
        return res.status(403).json({
          success: false,
          message: `You must be within ${MAX_CHECKIN_DISTANCE}m of ${spot.name} to check in. You are ${Math.round(distance)}m away.`,
          distance: Math.round(distance)
        });
      }

      // Grant 24-hour access
      const now = Date.now();
      const expiresAt = now + (24 * 60 * 60 * 1000); // 24 hours

      const access = {
        spotId,
        accessGrantedAt: now,
        expiresAt,
        trickId: `trick_${spotId}_${Date.now()}`,
        hologramUrl: `/tricks/holograms/${spotId}.glb`
      };

      res.json({
        success: true,
        message: `Successfully checked in at ${spot.name}!`,
        access,
        distance: Math.round(distance)
      });
    } catch (error) {
      console.error("Check-in error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error during check-in"
      });
    }
  });

  // Stripe payment endpoint for shopping cart checkout
  // SECURITY: Server-side price calculation to prevent client tampering
  app.post("/api/create-shop-payment-intent", async (req: Request, res: Response) => {
    try {
      if (!stripe) {
        return res.status(500).json({ message: "Stripe is not configured" });
      }

      const clientIP = req.ip || req.connection.remoteAddress;
      const { items } = req.body;

      // Validate items array
      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: "Invalid cart items" });
      }

      // Authoritative product pricing - THIS IS THE SOURCE OF TRUTH
      const productPrices: Record<string, number> = {
        "skatehubba-tee": 29.99,
        "trick-pack": 49.99,
        "pro-badge": 14.99,
      };

      // Calculate total server-side from authoritative prices
      let totalAmount = 0;
      const validatedItems = [];

      for (const item of items) {
        if (!item.id || !item.quantity || typeof item.quantity !== 'number') {
          return res.status(400).json({ message: "Invalid item format" });
        }

        const price = productPrices[item.id];
        if (price === undefined) {
          return res.status(400).json({ message: `Invalid product ID: ${item.id}` });
        }

        if (item.quantity < 1 || item.quantity > 99 || !Number.isInteger(item.quantity)) {
          return res.status(400).json({ message: "Invalid quantity" });
        }

        totalAmount += price * item.quantity;
        validatedItems.push({ id: item.id, quantity: item.quantity, price });
      }

      // Validate total amount
      if (totalAmount < 0.50 || totalAmount > 10000) {
        return res.status(400).json({ message: "Amount must be between $0.50 and $10,000" });
      }

      // Log payment attempt for security monitoring
      console.log(`Shop payment attempt: $${totalAmount.toFixed(2)} from IP: ${clientIP}, items: ${validatedItems.length}`);

      // Create a PaymentIntent with the server-calculated amount
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(totalAmount * 100), // Convert to cents
        currency: "usd",
        description: `SkateHubba Shop - ${validatedItems.length} items`,
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          items: JSON.stringify(validatedItems),
          ip: clientIP || "unknown",
        },
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error("Stripe payment intent error:", error);
      res.status(500).json({ 
        message: "Error creating payment intent: " + (error.message || "Unknown error")
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}