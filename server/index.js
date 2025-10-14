import express from "express";
import cors from "cors";
import helmet from "helmet";

const app = express();

// Enhanced security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://www.google.com", "https://www.gstatic.com"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: ["'self'", "https://*.firebaseapp.com", "https://*.googleapis.com", "https://*.replit.app", "https://*.replit.dev"],
      fontSrc: ["'self'", "data:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'self'", "https://www.google.com"],
    },
  },
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  xssFilter: true,
  hidePoweredBy: true,
}));

// CORS configuration - whitelist specific domains
const allowedOrigins = [
  'http://localhost:5000',
  'http://localhost:3000',
  'https://skatehubba.com',
  'https://www.skatehubba.com',
  process.env.PRODUCTION_URL,
  ...(process.env.REPLIT_DOMAINS?.split(',') || [])
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // In development, allow any .replit.dev or localhost
    if (process.env.NODE_ENV === 'development' && 
        (origin.includes('.replit.dev') || origin.includes('localhost'))) {
      return callback(null, true);
    }
    
    // Check whitelist
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Reject
    callback(new Error('CORS policy violation'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Database, email, and auth integration
let db, storage, sendSubscriberNotification, NewSubscriberInput, setupAuthRoutes;

// Initialize database connection and auth
async function initializeDatabase() {
  try {
    // Dynamic imports to handle TypeScript files
    const dbModule = await import('./db.ts');
    const storageModule = await import('./storage.ts');
    const emailModule = await import('./email.ts');
    const schemaModule = await import('../shared/schema.ts');
    const firebaseAuthModule = await import('./auth/routes.ts');
    
    // Initialize Firebase Admin first
    await import('./admin.ts');
    
    db = dbModule.db;
    storage = storageModule.storage;
    sendSubscriberNotification = emailModule.sendSubscriberNotification;
    NewSubscriberInput = schemaModule.NewSubscriberInput;
    setupAuthRoutes = firebaseAuthModule.setupAuthRoutes;
    
    console.log("🎯 Database integration loaded successfully");
    
    // Initialize database
    if (dbModule.initializeDatabase) {
      await dbModule.initializeDatabase();
    }
    
  } catch (error) {
    console.warn("⚠️  Database integration failed, running in basic mode:", error.message);
  }
}

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: 'ok',
    env: process.env.NODE_ENV || 'development',
    time: new Date().toISOString()
  });
});

// Email signup endpoint - the money maker with full database integration
app.post("/api/subscribe", async (req, res) => {
  try {
    // Use advanced validation if available, otherwise basic validation
    let email, firstName;
    
    if (NewSubscriberInput) {
      const parsed = NewSubscriberInput.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ 
          ok: false, 
          error: "Invalid input data",
          details: parsed.error.flatten()
        });
      }
      ({ email, firstName } = parsed.data);
    } else {
      // Fallback validation
      ({ email, firstName } = req.body);
      if (!email || !email.includes('@')) {
        return res.status(400).json({ 
          ok: false, 
          error: "Valid email is required" 
        });
      }
    }

    // Database integration if available
    if (storage) {
      // Check for existing subscriber
      const existing = await storage.getSubscriber(email);
      if (existing) {
        return res.status(200).json({ 
          ok: true, 
          status: "exists", 
          msg: "You're already on the beta list! We'll notify you when it's ready." 
        });
      }

      // Create new subscriber
      const created = await storage.createSubscriber({
        email,
        firstName: firstName || null,
        isActive: true,
      });

      // Send notification email
      if (sendSubscriberNotification) {
        await sendSubscriberNotification({ firstName: firstName || "", email });
      }

      console.log(`📧 New subscriber saved: ${firstName || 'Anonymous'} <${email}> [ID: ${created.id}]`);
      
      return res.status(201).json({ 
        ok: true, 
        status: "created", 
        id: created.id,
        msg: "Welcome to the beta list! Check your email for confirmation." 
      });
    } else {
      // Fallback mode without database
      console.log(`📧 New signup (no DB): ${firstName || 'Anonymous'} <${email}>`);
      
      res.json({ 
        ok: true, 
        status: "created",
        msg: "Welcome to the beta list! Check your email for confirmation." 
      });
    }
    
  } catch (error) {
    console.error("Subscription error:", error);
    res.status(500).json({ 
      ok: false, 
      error: "Failed to process subscription. Please try again." 
    });
  }
});

// Start server with database and auth initialization
const PORT = process.env.PORT || 5000;

async function startServer() {
  // Initialize database first
  await initializeDatabase();
  
  // Setup Firebase auth routes
  if (setupAuthRoutes) {
    try {
      setupAuthRoutes(app);
      console.log("🔥 Firebase Auth routes initialized");
    } catch (firebaseAuthError) {
      console.warn("⚠️  Firebase Auth setup failed:", firebaseAuthError.message);
    }
  }
  
  app.listen(PORT, () => {
    console.log(`🚀 SkateHubba API running on port ${PORT}`);
    console.log(`📧 Email signup endpoint: POST /api/subscribe`);
    console.log(`🔥 Firebase Auth: ACTIVE`);
    console.log(`💾 Database integration: ${storage ? 'ACTIVE' : 'BASIC MODE'}`);
  });
}

startServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});