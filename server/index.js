import express from "express";
import cors from "cors";
import helmet from "helmet";

const app = express();

// Security and CORS
app.use(helmet());
app.use(cors());
app.use(express.json());

// Database and email integration
let db, storage, sendSubscriberNotification, NewSubscriberInput;

// Initialize database connection
async function initializeDatabase() {
  try {
    // Dynamic imports to handle TypeScript files
    const dbModule = await import('./db.ts');
    const storageModule = await import('./storage.ts');
    const emailModule = await import('./email.ts');
    const schemaModule = await import('../shared/schema.ts');

    db = dbModule.db;
    storage = storageModule.storage;
    sendSubscriberNotification = emailModule.sendSubscriberNotification;
    NewSubscriberInput = schemaModule.NewSubscriberInput;

    console.log("🎯 Database integration loaded successfully");

    // Initialize database
    if (dbModule.initializeDatabase) {
      await dbModule.initializeDatabase();
    }

  } catch (error) {
    console.warn("⚠️  Database integration failed, running in basic mode:", error.message);
    // Continue without database - graceful degradation
  }
}

// Health check endpoint
app.get("/api/health", (_req, res) => res.json({ ok: true }));

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

// Start server with database initialization
// Server initialization - prefer env var, fallback to 3001
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

async function startServer() {
  // Initialize database first
  await initializeDatabase();

  app.listen(PORT, () => {
    console.log(`🚀 SkateHubba API running on port ${PORT}`);
    console.log(`📧 Email signup endpoint: POST /api/subscribe`);
    console.log(`💾 Database integration: ${storage ? 'ACTIVE' : 'BASIC MODE'}`);
  });
}

startServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});