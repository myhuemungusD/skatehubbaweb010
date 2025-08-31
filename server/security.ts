import crypto from "crypto";

// Security constants
export const SECURITY_CONFIG = {
  SESSION_TTL: 7 * 24 * 60 * 60 * 1000, // 1 week
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
  PASSWORD_MIN_LENGTH: 8,
  API_RATE_LIMIT: 100,
  PAYMENT_RATE_LIMIT: 10,
} as const;

// Validate critical environment variables
export function validateEnvironment() {
  const required = [
    "DATABASE_URL",
    "SESSION_SECRET",
    "REPL_ID",
    "STRIPE_SECRET_KEY",
  ];

  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`,
    );
  }

  // Validate session secret strength
  if (process.env.SESSION_SECRET!.length < 32) {
    console.warn(
      "SESSION_SECRET should be at least 32 characters for security",
    );
  }

  // Validate Stripe key format
  if (!process.env.STRIPE_SECRET_KEY!.startsWith("sk_")) {
    throw new Error("Invalid Stripe secret key format");
  }
}

// Generate secure random tokens
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString("hex");
}

// Secure string comparison
export function secureCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(Buffer.from(a, "utf8"), Buffer.from(b, "utf8"));
}

// IP address validation
export function isValidIP(ip: string): boolean {
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
}
