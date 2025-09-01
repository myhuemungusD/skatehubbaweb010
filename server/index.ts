import express from "express";
import path from "path";

const app = express();

// Health check endpoint
app.get("/api/health", (_req, res) => res.json({ ok: true }));

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const pub = path.join(__dirname, "public");

app.use(express.static(pub));
app.get(/^(?!\/api\/).*/, (_req, res) => res.sendFile(path.join(pub, "index.html")));

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