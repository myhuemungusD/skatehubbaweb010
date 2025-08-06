import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { storage } from "./storage";
import { 
  insertUserProgressSchema, 
  updateUserProgressSchema,
  insertUserSchema
} from "@shared/schema";

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
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid step ID" });
      }
      
      const step = await storage.getTutorialStep(id);
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
  app.get("/api/users/:userId/progress", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }

      const progress = await storage.getUserProgress(userId);
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
