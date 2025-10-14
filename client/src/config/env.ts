import { z } from 'zod';

const envSchema = z.object({
  MODE: z.string().default('development'),
  DEV: z.boolean().default(true),
  PROD: z.boolean().default(false),
  
  VITE_SENTRY_DSN: z.string().optional(),
  
  VITE_FIREBASE_API_KEY: z.string().optional(),
  VITE_FIREBASE_AUTH_DOMAIN: z.string().optional(),
  VITE_FIREBASE_PROJECT_ID: z.string().optional(),
  VITE_FIREBASE_STORAGE_BUCKET: z.string().optional(),
  VITE_FIREBASE_MESSAGING_SENDER_ID: z.string().optional(),
  VITE_FIREBASE_APP_ID: z.string().optional(),
  VITE_FIREBASE_MEASUREMENT_ID: z.string().optional(),
  
  VITE_RECAPTCHA_SITE_KEY: z.string().optional(), // ReCAPTCHA v3 site key for App Check
  
  VITE_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  VITE_DONATE_STRIPE_URL: z.string().optional(),
  VITE_DONATE_PAYPAL_URL: z.string().optional(),
});

function validateEnv() {
  try {
    return envSchema.parse(import.meta.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missing = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('\n');
      console.error(`Client environment validation failed:\n${missing}`);
      // In production, fail hard instead of returning empty object
      if (import.meta.env.PROD) {
        throw new Error('Critical environment variables missing. Cannot start application.');
      }
    }
    // Development fallback only
    return envSchema.parse({});
  }
}

export const env = validateEnv();
