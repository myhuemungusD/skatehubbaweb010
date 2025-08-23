import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Create the HTTP client for Neon
const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });

export async function initializeDatabase() {
  try {
    console.log("Initializing database...");

    // Test database connection first
    await db.select().from(tutorialSteps).limit(1);
    console.log("Database connection successful");

    // Check if tutorial steps exist
    const existingSteps = await db.select().from(tutorialSteps).limit(1);

    if (existingSteps.length === 0) {
      console.log("Seeding tutorial steps...");
      await seedTutorialSteps();
      console.log("Tutorial steps seeded successfully");
    } else {
      console.log("Tutorial steps already initialized");
    }
  } catch (error) {
    console.error("Database initialization failed:", error);
    // Don't throw in production, just log the error
    if (process.env.NODE_ENV !== 'production') {
      throw error;
    }
  }
}