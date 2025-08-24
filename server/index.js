import express from "express";
import compression from "compression";
import sirv from "sirv";
import path from "node:path";
import fs from "node:fs";

const app = express();
const isProd = process.env.NODE_ENV === "production";
const dist = path.resolve(process.cwd(), "dist");

// Security basics
app.disable("x-powered-by");
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy",
    "default-src 'self'; img-src 'self' data:; script-src 'self' https://plausible.io; " +
    "connect-src 'self' https://plausible.io; style-src 'self' 'unsafe-inline'; " +
    "frame-src https://js.stripe.com https://hooks.stripe.com");
  next();
});

app.use(compression());
app.use(express.json());

// Example API
app.post("/api/waitlist", (req, res) => {
  const { email } = req.body || {};
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ ok:false, error:"invalid_email" });
  // TODO: write to DB or sheet. For now: append to file.
  fs.appendFileSync(path.join(process.cwd(), "waitlist.csv"), `${Date.now()},${email}\n`);
  res.json({ ok:true });
});

// Static assets
if (isProd) {
  app.use(sirv(dist, { single: true, etag: true, maxAge: 31536000 }));
  // Fallback to SPA index.html for unmatched routes
  app.get("*", (req, res) => res.sendFile(path.join(dist, "index.html")));
} else {
  // Dev: let Vite serve frontend on 5173; this server is only for /api
  app.get("/", (_req, res) => res.send("Dev API running. Frontend on http://localhost:5173"));
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server on :${port}`));