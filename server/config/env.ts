import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3001'),
  
  // Required for all environments
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  SESSION_SECRET: z.string().min(32, 'SESSION_SECRET must be at least 32 characters'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters (no defaults allowed)'),
  
  // Replit environment (optional)
  REPL_ID: z.string().optional(),
  CLIENT_SECRET: z.string().optional(),
  REPLIT_DOMAINS: z.string().optional(),
  ISSUER_URL: z.string().optional(),
  REPL_SLUG: z.string().optional(),
  REPL_OWNER: z.string().optional(),
  
  // Firebase (required for auth to work)
  VITE_FIREBASE_PROJECT_ID: z.string().min(1, 'Firebase Project ID is required'),
  FIREBASE_ADMIN_KEY: z.string().min(1, 'Firebase Admin Key is required for backend auth'),
  
  // Payment providers (optional unless payments are enabled)
  STRIPE_SECRET_KEY: z.string().optional(),
  TESTING_STRIPE_SECRET_KEY: z.string().optional(),
  
  // Email services (optional)
  RESEND_API_KEY: z.string().optional(),
  EMAIL_USER: z.string().optional(),
  EMAIL_APP_PASSWORD: z.string().optional(),
  
  // AI services (optional)
  OPENAI_API_KEY: z.string().optional(),
  GOOGLE_AI_API_KEY: z.string().optional(),
  
  // Admin access (optional, but recommended for production)
  ADMIN_API_KEY: z.string().optional(),
  
  // Monitoring & URLs
  SENTRY_DSN: z.string().optional(),
  PRODUCTION_URL: z.string().optional(),
});

function validateEnv() {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missing = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('\n');
      throw new Error(`Environment validation failed:\n${missing}`);
    }
    throw error;
  }
}

export const env = validateEnv();
