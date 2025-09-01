import express from "express";
import path from "path";
import { serveStatic } from "./viteStatic.js";

const app = express();

// Health check endpoint
app.get("/api/health", (_req, res) => res.json({ ok: true }));

serveStatic(app);

const port = Number(process.env.PORT) || (process.env.NODE_ENV === "production" ? 8080 : 5000);
const server = app.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${port} in ${process.env.NODE_ENV || "development"} mode`);
});

// Handle graceful shutdown
process.on("SIGTERM", () => {
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});