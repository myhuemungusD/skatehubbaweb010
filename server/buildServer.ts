
import express, { type Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { setupVite, serveStatic, log } from "./vite.js";
import { validateEnvironment } from "./security.js";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import compression from "compression";
import pinoHttp from "pino-http";
import { authRoutes } from "./auth/routes.js";
import geminiRoutes from "./gemini-routes.js";
import secureSignupRoutes from "./routes/secure-signup.js";
import debugRoutes from "./debug-routes.js";

// Validate environment on startup
validateEnvironment();

export async function buildServer() {
  const app = express();

  // Enable gzip compression
  app.use(compression());

  // Structured logging
  if (process.env.NODE_ENV === "production") {
    app.use(
      pinoHttp({
        level: "info",
        serializers: {
          req: (req) => ({
            method: req.method,
            url: req.url,
            userAgent: req.headers["user-agent"],
          }),
          res: (res) => ({
            statusCode: res.statusCode,
          }),
        },
      }),
    );
  }

  // Security middleware
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: [
            "'self'",
            "'unsafe-inline'",
            "https://cdn.jsdelivr.net",
            "https://js.stripe.com",
            "https://replit.com",
          ],
          styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
          imgSrc: ["'self'", "data:", "https:", "blob:"],
          connectSrc: ["'self'", "https://api.stripe.com", "wss:", "ws:"],
          fontSrc: ["'self'", "https:", "data:"],
          objectSrc: ["'none'"],
          mediaSrc: ["'self'"],
          frameSrc: [
            "'self'",
            "https://js.stripe.com",
            "https://hooks.stripe.com",
          ],
          frameAncestors: ["'none'"],
          baseUri: ["'self'"],
          formAction: ["'self'"],
        },
        reportOnly: false,
      },
      crossOriginEmbedderPolicy: false,
      hsts: {
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true,
      },
      noSniff: true,
      xssFilter: true,
      referrerPolicy: { policy: "strict-origin-when-cross-origin" },
      permittedCrossDomainPolicies: false,
    }),
  );

  // Force HTTPS in production
  if (process.env.NODE_ENV === "production") {
    app.use((req: Request, res: Response, next: NextFunction) => {
      if (req.header("x-forwarded-proto") !== "https") {
        res.redirect(`https://${req.header("host")}${req.url}`);
      } else {
        next();
      }
    });
  }

  app.use(
    cors({
      origin:
        process.env.NODE_ENV === "production"
          ? ["https://skatehubba.com", "https://www.skatehubba.com"]
          : [
              "http://localhost:5173",
              "http://0.0.0.0:5173",
              "http://localhost:5000",
              "http://0.0.0.0:5000",
            ],
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    }),
  );
  app.use(cookieParser());

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: process.env.NODE_ENV === "development" ? 1000 : 100, // Higher limit for development
    message: {
      error: "Too many requests from this IP, please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 auth requests per windowMs
    message: {
      error: "Too many authentication attempts, please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  const paymentLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // limit each IP to 10 payment attempts per hour
    message: {
      error: "Too many payment attempts, please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  const subscribeLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3, // limit each IP to 3 subscription attempts per 15 minutes
    message: {
      error: "Too many subscription attempts, please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  // Apply rate limiting only in production
  if (process.env.NODE_ENV !== "development") {
    app.use(limiter);
    app.use("/api/auth", authLimiter);
    app.use("/api/create-payment-intent", paymentLimiter);
    app.use("/api/subscribe", subscribeLimiter);
  }

  // Body parsing with size limits
  app.use(express.json({ limit: "32kb" }));
  app.use(express.urlencoded({ extended: false, limit: "32kb" }));

  app.use((req, res, next) => {
    const start = Date.now();
    const path = req.path;
    let capturedJsonResponse: Record<string, any> | undefined = undefined;

    const originalResJson = res.json;
    res.json = function (bodyJson: any, ...args: any[]) {
      capturedJsonResponse = bodyJson;
      return originalResJson.apply(res, [bodyJson, ...args]);
    };

    res.on("finish", () => {
      const duration = Date.now() - start;
      if (path.startsWith("/api")) {
        let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
        if (capturedJsonResponse) {
          logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
        }

        if (logLine.length > 80) {
          logLine = logLine.slice(0, 79) + "…";
        }

        log(logLine);
      }
    });

    next();
  });

  // Mount API routes
  app.use("/api/auth", authRoutes);
  app.use("/api/gemini", geminiRoutes);
  app.use("/api", secureSignupRoutes);
  app.use("/api", debugRoutes);

  // Mount optional replitAuth route if file exists
  try {
    const { default: replitAuthRoute } = await import("./replitAuth.js");
    app.use("/api/auth/replit", replitAuthRoute);
  } catch (e: any) {
    if (!/MODULE_NOT_FOUND|ERR_MODULE_NOT_FOUND/.test(e?.code || e?.message)) throw e;
    console.log("replitAuth route not present. Skipping.");
  }

  // Error handling middleware
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error(`Error ${status}: ${message}`, err);
    res.status(status).json({ message });
  });

  // Setup Vite or static serving after all routes are configured
  if (process.env.NODE_ENV === "development") {
    const { createServer } = await import("http");
    const server = createServer(app);
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  return app;
}
