import crypto from "crypto";
import { env } from './config/env';

export const SECURITY_CONFIG = {
  SESSION_TTL: 7 * 24 * 60 * 60 * 1000,
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000,
  PASSWORD_MIN_LENGTH: 8,
  API_RATE_LIMIT: 100,
  PAYMENT_RATE_LIMIT: 10,
} as const;

export function validateEnvironment() {
  if (env.SESSION_SECRET.length < 32) {
    console.warn('SESSION_SECRET should be at least 32 characters for security');
  }

  if (env.STRIPE_SECRET_KEY && !env.STRIPE_SECRET_KEY.startsWith('sk_')) {
    throw new Error('Invalid Stripe secret key format');
  }
}

// Generate secure random tokens
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

// Secure string comparison
export function secureCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(Buffer.from(a, 'utf8'), Buffer.from(b, 'utf8'));
}

// IP address validation
export function isValidIP(ip: string): boolean {
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
}
