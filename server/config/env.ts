import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3001'),
  
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  SESSION_SECRET: z.string().min(32, 'SESSION_SECRET must be at least 32 characters'),
  
  JWT_SECRET: z.string().default('your-secret-key-change-this'),
  
  REPL_ID: z.string().optional(),
  CLIENT_SECRET: z.string().optional(),
  REPLIT_DOMAINS: z.string().optional(),
  ISSUER_URL: z.string().optional(),
  REPL_SLUG: z.string().optional(),
  REPL_OWNER: z.string().optional(),
  
  VITE_FIREBASE_PROJECT_ID: z.string().optional(),
  FIREBASE_ADMIN_KEY: z.string().optional(),
  
  STRIPE_SECRET_KEY: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  GOOGLE_AI_API_KEY: z.string().optional(),
  
  EMAIL_USER: z.string().optional(),
  EMAIL_APP_PASSWORD: z.string().optional(),
  
  ADMIN_API_KEY: z.string().optional(),
  
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
