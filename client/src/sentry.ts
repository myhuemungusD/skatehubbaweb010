import * as Sentry from '@sentry/react';
import { env } from './config/env';

if (env.VITE_SENTRY_DSN) {
  Sentry.init({ 
    dsn: env.VITE_SENTRY_DSN, 
    tracesSampleRate: 1.0,
    environment: env.MODE
  });
}

export default Sentry;