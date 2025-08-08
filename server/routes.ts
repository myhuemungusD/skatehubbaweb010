import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import Stripe from "stripe";
import { storage } from "./storage";
import { 
  insertUserProgressSchema, 
  updateUserProgressSchema,
  insertUserSchema
} from "@shared/schema";
import crypto from "crypto";
import validator from "validator";

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

// Authentication middleware
const authenticateUser = (req: any, res: any, next: any) => {
  // For demo purposes - implement proper session/JWT validation
  const authHeader = req.headers.authorization;
  if (!authHeader && req.path.includes('/users/') && req.method !== 'GET') {
    return res.status(401).json({ error: "Authentication required" });
  }
  next();
};

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
  app.get("/api/users/:userId/progress", authenticateUser, async (req, res) => {
    try {
      const { userId } = req.params;
      if (!validateId(userId)) {
        return res.status(400).json({ error: "Invalid user ID format" });
      }

      const userIdInt = parseInt(userId);
      const progress = await storage.getUserProgress(userIdInt);
      res.json(progress);
    } catch (error) {
      console.error("Failed to get user progress:", error);
      res.status(500).json({ error: "Failed to retrieve user progress" });
    }
  });

  app.get("/api/users/:userId/progress/:stepId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const stepId = parseInt(req.params.stepId);
      
      if (isNaN(userId) || isNaN(stepId)) {
        return res.status(400).json({ error: "Invalid user ID or step ID" });
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
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }

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
      const userId = parseInt(req.params.userId);
      const stepId = parseInt(req.params.stepId);
      
      if (isNaN(userId) || isNaN(stepId)) {
        return res.status(400).json({ error: "Invalid user ID or step ID" });
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
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }

      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Remove sensitive data
      const { password, ...safeUser } = user;
      res.json(safeUser);
    } catch (error) {
      console.error("Failed to get user:", error);
      res.status(500).json({ error: "Failed to retrieve user" });
    }
  });

  app.patch("/api/users/:id/onboarding", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }

      const { completed, currentStep } = req.body;
      if (typeof completed !== "boolean") {
        return res.status(400).json({ error: "Invalid completed status" });
      }

      const user = await storage.updateUserOnboardingStatus(id, completed, currentStep);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Remove sensitive data
      const { password, ...safeUser } = user;
      res.json(safeUser);
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
