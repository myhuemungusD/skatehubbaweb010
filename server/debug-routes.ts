import express from "express";

const router = express.Router();

// Debug endpoint to test security middleware
router.get("/debug/security-test", (req, res) => {
  res.json({
    userAgent: req.get("User-Agent"),
    ip: req.headers["x-forwarded-for"] || req.connection.remoteAddress,
    headers: req.headers,
    timestamp: new Date().toISOString(),
  });
});

// Test endpoint for rate limiting
router.post("/debug/rate-limit-test", (req, res) => {
  res.json({ message: "Rate limit test successful", timestamp: Date.now() });
});

export default router;
