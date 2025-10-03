import express, { type Request, Response, NextFunction } from "express";
import cors from "cors";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const compression = require('compression');
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { validateEnvironment } from "./security";
import rateLimit from "express-rate-limit";
// import pinoHttp from "pino-http";
// import Sentry from "./sentry.js";

// Validate environment on startup
validateEnvironment();

const app = express();

// Enable gzip compression
app.use(compression());

// Structured logging
if (process.env.NODE_ENV === 'production') {
  app.use(pinoHttp({
    level: 'info',
    serializers: {
      req: (req) => ({
        method: req.method,
        url: req.url,
        userAgent: req.headers['user-agent']
      }),
      res: (res) => ({
        statusCode: res.statusCode
      })
    }
  }));
}

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://js.stripe.com", "https://replit.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: ["'self'", "https://api.stripe.com", "wss:", "ws:"],
      fontSrc: ["'self'", "https:", "data:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'self'", "https://js.stripe.com", "https://hooks.stripe.com"],
      frameAncestors: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"]
    },
    reportOnly: false
  },
  crossOriginEmbedderPolicy: false,
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  permittedCrossDomainPolicies: false
}));

// Force HTTPS in production
if (process.env.NODE_ENV === 'production') {
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });
}

app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://skatehubba.com', 'https://www.skatehubba.com']
    : ['http://localhost:5173', 'http://0.0.0.0:5173', 'http://localhost:5000', 'http://0.0.0.0:5000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(cookieParser());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'development' ? 1000 : 100, // Higher limit for development
  message: {
    error: "Too many requests from this IP, please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Stricter rate limiting for subscription endpoint
export const subscribeLimit = rateLimit({
  windowMs: 60_000, // 1 minute
  max: 5, // 5 requests per minute
  message: { ok: false, msg: 'Too many subscription attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false
});

// Apply rate limiting only in production
if (process.env.NODE_ENV !== 'development') {
  app.use(limiter);
}

// Body parsing with size limits
app.use(express.json({ limit: '32kb' }));
app.use(express.urlencoded({ extended: false, limit: '32kb' }));

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

(async () => {
  try {
    const server = await registerRoutes(app);

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      console.error(`Error ${status}: ${message}`, err);
      res.status(status).json({ message });
    });

    // importantly only setup vite in development and after
    // setting up all the other routes so the catch-all route
    // doesn't interfere with the other routes
    if (process.env.NODE_ENV === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    // ALWAYS serve the app on the port specified in the environment variable PORT
    // Other ports are firewalled. Default to 5000 if not specified.
    // this serves both the API and the client.
    // It is the only port that is not firewalled.
    const port = parseInt(process.env.PORT || '5000', 10);
    server.listen({
      port,
      host: "0.0.0.0",
      reusePort: true,
    }, () => {
      log(`🚀 Server running on port ${port} in ${process.env.NODE_ENV || 'development'} mode`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
})();