
import { Router } from "express";

const router = Router();

// Health check endpoint
router.get("/health", (_req, res) => {
  res.json({ ok: true });
});

// Add your Replit auth handlers here
router.get("/login", (_req, res) => {
  res.json({ message: "Replit login endpoint" });
});

router.get("/callback", (_req, res) => {
  res.json({ message: "Replit callback endpoint" });
});

export default router;
