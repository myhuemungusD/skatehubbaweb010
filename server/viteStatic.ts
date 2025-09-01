import path from "path";
import { fileURLToPath } from "url";
import express, { type Express } from "express";

export function serveStatic(app: Express) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const pub = path.join(__dirname, "public");
  app.use(express.static(pub));
  // SPA fallback for non-API routes
  app.get(/^(?!\/api\/).*/, (_req, res) => res.sendFile(path.join(pub, "index.html")));
}