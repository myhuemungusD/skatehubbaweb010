import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from "../shared/schema.ts";
import { env } from './config/env';

// Only initialize database connection if we have a valid DATABASE_URL
let db: any = null;
try {
  if (env.DATABASE_URL && env.DATABASE_URL !== 'postgresql://dummy:dummy@localhost:5432/dummy') {
    const sql = neon(env.DATABASE_URL);
    db = drizzle(sql, { schema });
  }
} catch (error) {
  console.warn('Database connection setup failed:', error instanceof Error ? error.message : String(error));
  db = null;
}

export { db };

export async function initializeDatabase() {
  if (!db) {
    console.log("Database not configured, skipping initialization");
    return;
  }

  try {
    console.log("Initializing database...");

    // Test database connection first
    await db.select().from(schema.tutorialSteps).limit(1);
    console.log("Database connection successful");

    // Check if tutorial steps exist
    const existingSteps = await db.select().from(schema.tutorialSteps).limit(1);

    if (existingSteps.length === 0) {
      console.log("Seeding tutorial steps...");
      // Seed tutorial steps - basic implementation
      const defaultSteps = [
        {
          title: "Welcome to SkateHubba",
          description: "Learn the basics of navigating the skate community",
          type: "intro" as const,
          content: { videoUrl: "https://example.com/intro-video" },
          order: 1,
          isActive: true
        }
      ];
      for (const step of defaultSteps) {
        await db.insert(schema.tutorialSteps).values(step);
      }
      console.log("Tutorial steps seeded successfully");
    } else {
      console.log("Tutorial steps already initialized");
    }
  } catch (error) {
    console.error("Database initialization failed - continuing without default tutorial steps:", error instanceof Error ? error.message : String(error));
    // Don't throw error in development - allow app to run without database
    if (env.NODE_ENV === 'production') {
      throw error;
    }
  }
}