// Use the buildServer function which contains all the server setup
import { buildServer } from "./buildServer.js";

// Start the server using buildServer
(async () => {
  try {
    const app = await buildServer();
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
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
})();