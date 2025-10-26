import express from "express";
import cors from "cors";
import helmet from "helmet";

const app = express();

// Enhanced security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://www.google.com", "https://www.gstatic.com", "https://js.stripe.com"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: ["'self'", "https://*.firebaseapp.com", "https://*.googleapis.com", "https://*.replit.app", "https://*.replit.dev", "https://api.stripe.com"],
      fontSrc: ["'self'", "data:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'self'", "https://www.google.com", "https://js.stripe.com", "https://hooks.stripe.com"],
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
let db, storage, sendSubscriberNotification, NewSubscriberInput, setupAuthRoutes, feedback, insertFeedbackSchema;

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
    feedback = schemaModule.feedback;
    insertFeedbackSchema = schemaModule.insertFeedbackSchema;
    
    console.log("🎯 Database integration loaded successfully");
    
    // Initialize database
    if (dbModule.initializeDatabase) {
      await dbModule.initializeDatabase();
    }
    
  } catch (error) {
    console.warn("⚠️  Database integration failed, running in basic mode:", error.message);
  }
}

// /api/health and /api/subscribe are now defined in server/routes.ts
// to avoid duplicate route handlers

// Feedback endpoint
app.post("/api/feedback", async (req, res) => {
  try {
    const { type, message } = req.body;
    
    // Basic validation even without database
    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        ok: false,
        error: "Feedback message is required"
      });
    }
    
    const user = req.user;
    
    // Database integration if available
    if (db && insertFeedbackSchema && feedback) {
      const validatedData = insertFeedbackSchema.parse({
        userId: user?.uid || null,
        userEmail: user?.email || null,
        type: type || 'general',
        message,
      });

      const [result] = await db.insert(feedback).values(validatedData).returning();

      console.log(`📝 Feedback saved: Type=${type || 'general'}, User=${user?.email || 'Anonymous'} [ID: ${result.id}]`);
      
      return res.json({ 
        ok: true, 
        message: 'Feedback submitted successfully',
        id: result.id 
      });
    } else {
      // Fallback mode without database
      console.log(`📝 Feedback received (no DB): Type=${type || 'general'}, User=${user?.email || 'Anonymous'}`);
      console.log(`   Message: ${message.substring(0, 100)}${message.length > 100 ? '...' : ''}`);
      
      return res.status(503).json({ 
        ok: false, 
        error: "Feedback service temporarily unavailable. Please try again later." 
      });
    }
  } catch (error) {
    console.error('Feedback submission error:', error);
    res.status(400).json({ 
      ok: false, 
      error: error.message || 'Failed to submit feedback' 
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
  
  // Register all API routes from routes.ts
  try {
    const { registerRoutes } = await import('./routes.ts');
    await registerRoutes(app);
    console.log("✅ All API routes registered");
  } catch (routesError) {
    console.warn("⚠️  Some API routes failed to register:", routesError.message);
  }
  
  // Create HTTP server
  const { createServer } = await import('http');
  const server = createServer(app);
  
  // Setup Vite middleware in development mode
  if (process.env.NODE_ENV === 'development') {
    const { setupVite } = await import('./vite.ts');
    await setupVite(app, server);
    console.log('⚡ Vite dev server integrated');
  } else {
    // In production, serve static files
    const { serveStatic } = await import('./vite.ts');
    serveStatic(app);
    console.log('📦 Serving static files from dist/public');
  }
  
  server.listen(PORT, () => {
    console.log(`🚀 SkateHubba running on port ${PORT}`);
    console.log(`📧 Email signup endpoint: POST /api/subscribe`);
    console.log(`📝 Feedback endpoint: POST /api/feedback`);
    console.log(`🔥 Firebase Auth: ACTIVE`);
    console.log(`💾 Database integration: ${storage ? 'ACTIVE' : 'BASIC MODE'}`);
  });
}

startServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});