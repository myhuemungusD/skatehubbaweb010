import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import Stripe from "stripe";
import { storage } from "./storage";
import { 
  insertUserProgressSchema, 
  updateUserProgressSchema
} from "@shared/schema";
import crypto from "crypto";
import validator from "validator";
import { sendSubscriberNotification } from "./email";
import { setupAuth, isAuthenticated } from "./replitAuth";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

// Security validation functions
const sanitizeString = (str: string): string => {
  return validator.escape(str.trim());
};

const validateId = (id: string): boolean => {
  return validator.isInt(id, { min: 1 });
};

const validateEmail = (email: string): boolean => {
  return validator.isEmail(email) && validator.isLength(email, { max: 254 });
};

// Remove old authentication - now using Replit Auth

// Request validation middleware
const validateRequest = (schema: z.ZodSchema) => (req: any, res: any, next: any) => {
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

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Tutorial Steps Routes
  app.get("/api/tutorial/steps", async (req, res) => {
    try {
      const steps = await storage.getAllTutorialSteps();
      res.json(steps);
    } catch (error) {
      console.error("Failed to get tutorial steps:", error);
      res.status(500).json({ error: "Failed to retrieve tutorial steps" });
    }
  });

  app.get("/api/tutorial/steps/:id", async (req, res) => {
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
  app.get("/api/users/:userId/progress", isAuthenticated, async (req, res) => {
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

  app.post("/api/users/:userId/progress", isAuthenticated, async (req, res) => {
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

  app.patch("/api/users/:userId/progress/:stepId", isAuthenticated, async (req, res) => {
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
  app.get("/api/users/:id", isAuthenticated, async (req, res) => {
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

  app.patch("/api/users/:id/onboarding", isAuthenticated, async (req, res) => {
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

  // Stripe payment routes
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount, currency = "usd", description = "SkateHubba Donation" } = req.body;
      
      // Validate amount
      if (!amount || typeof amount !== 'number' || amount < 0.50 || amount > 10000) {
        return res.status(400).json({ error: "Amount must be between $0.50 and $10,000" });
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

  // Subscriber routes
  app.post("/api/subscribe", async (req, res) => {
    try {
      const { firstName, email } = req.body;
      
      // Validate input
      if (!firstName || !email) {
        return res.status(400).json({ error: "First name and email are required" });
      }

      if (!validateEmail(email)) {
        return res.status(400).json({ error: "Invalid email format" });
      }

      const sanitizedFirstName = sanitizeString(firstName);
      if (sanitizedFirstName.length < 1 || sanitizedFirstName.length > 50) {
        return res.status(400).json({ error: "First name must be between 1 and 50 characters" });
      }

      // Check if already subscribed
      const existingSubscriber = await storage.getSubscriber(email.toLowerCase());
      if (existingSubscriber) {
        return res.status(409).json({ error: "Email already subscribed" });
      }

      const subscriber = await storage.createSubscriber({
        firstName: sanitizedFirstName,
        email: email.toLowerCase()
      });

      // Send email notification (async, don't wait for it)
      sendSubscriberNotification({
        firstName: subscriber.firstName,
        email: subscriber.email
      }).catch(err => console.error('Email notification failed:', err));

      res.status(201).json({ 
        message: "Successfully subscribed!",
        firstName: subscriber.firstName 
      });
    } catch (error) {
      console.error("Failed to create subscriber:", error);
      res.status(500).json({ error: "Failed to process subscription" });
    }
  });

  // Get all subscribers
  app.get("/api/subscribers", async (req, res) => {
    try {
      const subscribers = await storage.getSubscribers();
      res.json(subscribers);
    } catch (error) {
      console.error("Failed to get subscribers:", error);
      res.status(500).json({ error: "Failed to retrieve subscribers" });
    }
  });

  // Create demo user for testing (temporary)
  app.post("/api/demo-user", async (req, res) => {
    try {
      const demoUser = await storage.createUser({
        username: "demo_skater_" + Date.now(),
        password: "demo123"
      });

      // Remove sensitive data
      const { password, ...safeUser } = demoUser;
      res.status(201).json(safeUser);
    } catch (error) {
      console.error("Failed to create demo user:", error);
      res.status(500).json({ error: "Failed to create demo user" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
