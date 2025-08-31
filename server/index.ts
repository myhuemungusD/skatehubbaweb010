import express from "express";
import { registerRoutes } from "./routes";
import { setupVite } from "./vite";
import { createServer } from "http";

const app = express();

// CORS middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

const port = parseInt(process.env.PORT || "5000", 10);

async function startServer() {
  try {
    console.log("🔄 Starting SkateHubba server...");

    const httpServer = await registerRoutes(app);

    if (process.env.NODE_ENV === "development") {
      await setupVite(app, httpServer);
    }

    httpServer.listen(port, "0.0.0.0", () => {
      console.log(`🚀 SkateHubba server running on port ${port}`);
      console.log(`📱 Preview: http://localhost:${port}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
