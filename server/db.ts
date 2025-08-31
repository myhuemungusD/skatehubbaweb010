import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../shared/schema.js";

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
          isActive: true,
        },
      ];
      for (const step of defaultSteps) {
        await db.insert(schema.tutorialSteps).values(step);
      }
      console.log("Tutorial steps seeded successfully");
    } else {
      console.log("Tutorial steps already initialized");
    }
  } catch (error) {
    console.error("Database initialization failed:", error);
    // Don't throw in production, just log the error
    if (process.env.NODE_ENV !== "production") {
      throw error;
    }
  }
}
