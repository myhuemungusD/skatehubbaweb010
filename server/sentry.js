import * as Sentry from '@sentry/node';

const SENTRY_DSN = process.env.SENTRY_DSN;

if (SENTRY_DSN) {
  Sentry.init({ 
    dsn: SENTRY_DSN, 
    tracesSampleRate: 1.0,
    environment: process.env.NODE_ENV || 'development'
  });
}

export default Sentry;