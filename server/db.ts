import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Use connection pooling for better performance
const poolUrl = process.env.DATABASE_URL.includes('-pooler.') 
  ? process.env.DATABASE_URL 
  : process.env.DATABASE_URL.replace('.us-east-2', '-pooler.us-east-2');

export const pool = new Pool({ 
  connectionString: poolUrl,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export const db = drizzle({ client: pool, schema });