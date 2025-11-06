import 'dotenv/config';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors, { type CorsOptions } from 'cors';
import express, { type Application, type NextFunction, type Request, type Response } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { randomUUID } from 'crypto';

import { validateEnvironment } from './security';
import { setupVite, serveStatic } from './vite';
import { registerRoutes } from './routes';
import logger, { createChildLogger } from './logger';
import { initializeDatabase, db } from './db';
import { feedback, insertFeedbackSchema } from '../shared/schema.ts';

interface RequestWithUser extends Request {
  user?: {
    uid?: string;
    email?: string;
  };
}

const isProduction = process.env.NODE_ENV === 'production';

const allowedOrigins = [
  'http://localhost:5000',
  'http://0.0.0.0:5000',
  'http://localhost:3000',
  'http://localhost:5173',
  'http://0.0.0.0:5173',
  'https://skatehubba.com',
  'https://www.skatehubba.com',
  process.env.PRODUCTION_URL ?? '',
  ...((process.env.REPLIT_DOMAINS ?? '')
    .split(',')
    .map((domain) => domain.trim())
    .filter(Boolean)),
];

const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (!origin) {
      callback(null, true);
      return;
    }

    const normalizedOrigin = origin.toLowerCase();

    if (!isProduction && (normalizedOrigin.includes('localhost') || normalizedOrigin.includes('.replit.dev'))) {
      callback(null, true);
      return;
    }

    if (normalizedOrigin.endsWith('.replit.app')) {
      callback(null, true);
      return;
    }

    if (allowedOrigins.some((allowed) => allowed.toLowerCase() === normalizedOrigin)) {
      callback(null, true);
      return;
    }

    if (!isProduction) {
      logger.warn({ origin }, 'Allowing non-whitelisted origin in development');
      callback(null, true);
      return;
    }

    logger.warn({ origin }, 'Blocked by CORS policy');
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isProduction ? 100 : 1000,
  standardHeaders: true,
  legacyHeaders: false,
});

const subscribeRateLimiter = rateLimit({
  windowMs: 60_000,
  max: isProduction ? 5 : 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, msg: 'Too many subscription attempts, please try again later.' },
});

const createApp = async (): Promise<Application> => {
  validateEnvironment();

  await initializeDatabase();

  const app = express();

  app.disable('x-powered-by');
  app.set('trust proxy', 1);

  app.use(compression());
  app.use(cookieParser());
  app.use(express.json({ limit: '32kb' }));
  app.use(express.urlencoded({ extended: false, limit: '32kb' }));

  app.use(
    helmet({
      contentSecurityPolicy: isProduction
        ? {
            directives: {
              defaultSrc: ["'self'"],
              scriptSrc: [
                "'self'",
                "'unsafe-inline'",
                'https://www.google.com',
                'https://www.gstatic.com',
                'https://js.stripe.com',
              ],
              styleSrc: ["'self'", "'unsafe-inline'"],
              imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
              connectSrc: [
                "'self'",
                'https://*.firebaseapp.com',
                'https://*.googleapis.com',
                'https://*.replit.app',
                'https://*.replit.dev',
                'https://*.stripe.com',
              ],
              fontSrc: ["'self'", 'data:'],
              objectSrc: ["'none'"],
              mediaSrc: ["'self'"],
              frameSrc: ["'self'", 'https://www.google.com', 'https://js.stripe.com', 'https://*.stripe.com'],
            },
          }
        : false,
      crossOriginEmbedderPolicy: false,
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    }),
  );

  app.use(cors(corsOptions));

  if (isProduction) {
    app.use(globalRateLimiter);
  }

  app.use('/api/subscribe', subscribeRateLimiter);

  app.use((req, res, next) => {
    const requestId = randomUUID();
    const startTime = process.hrtime.bigint();
    res.locals.requestId = requestId;
    res.setHeader('x-request-id', requestId);

    res.on('finish', () => {
      const durationMs = Number(process.hrtime.bigint() - startTime) / 1_000_000;
      const childLogger = createChildLogger({
        requestId,
        method: req.method,
        path: req.originalUrl,
        statusCode: res.statusCode,
        durationMs: Number(durationMs.toFixed(3)),
      });

      if (res.statusCode >= 500) {
        childLogger.error('Request completed with server error');
      } else if (res.statusCode >= 400) {
        childLogger.warn('Request completed with client error');
      } else {
        childLogger.info('Request completed successfully');
      }
    });

    res.on('error', (error) => {
      logger.error({ requestId, err: error }, 'Response stream error');
    });

    next();
  });

  app.get('/healthz', (_req, res) => {
    res.status(200).json({ ok: true, ts: Date.now() });
  });

  app.post('/api/feedback', async (req: RequestWithUser, res: Response) => {
    if (!db) {
      logger.warn({ route: 'feedback' }, 'Feedback service unavailable (database not configured)');
      return res.status(503).json({
        ok: false,
        error: 'Feedback service temporarily unavailable. Please try again later.',
      });
    }

    const type = typeof req.body?.type === 'string' && req.body.type.trim().length > 0 ? req.body.type.trim() : 'general';
    const message = typeof req.body?.message === 'string' ? req.body.message.trim() : '';

    if (message.length === 0) {
      return res.status(400).json({
        ok: false,
        error: 'Feedback message is required',
      });
    }

    const parsed = insertFeedbackSchema.safeParse({
      userId: req.user?.uid,
      userEmail: req.user?.email,
      type,
      message,
    });

    if (!parsed.success) {
      logger.warn({ issues: parsed.error.flatten() }, 'Invalid feedback submission payload');
      return res.status(400).json({
        ok: false,
        error: 'Invalid feedback submission',
        details: parsed.error.flatten(),
      });
    }

    try {
      const [created] = await db.insert(feedback).values(parsed.data).returning();
      logger.info({ feedbackId: created.id, type: parsed.data.type }, 'Feedback stored successfully');
      return res.json({
        ok: true,
        message: 'Feedback submitted successfully',
        id: created.id,
      });
    } catch (error) {
      logger.error({ err: error }, 'Failed to persist feedback');
      return res.status(500).json({
        ok: false,
        error: 'Failed to submit feedback',
      });
    }
  });

  await registerRoutes(app);

  app.use((err: Error & { status?: number }, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status ?? 500;
    logger.error({ err, status }, 'Unhandled application error');
    res.status(status).json({
      error: status >= 500 ? 'Internal Server Error' : err.message,
    });
  });

  return app;
};

const startServer = async () => {
  try {
    const app = await createApp();
    const server = createServer(app);

    if (!isProduction) {
      await setupVite(app, server);
      logger.info('Vite development middleware enabled');
    } else {
      serveStatic(app);
      logger.info('Serving prebuilt client assets');
    }

    const port = Number(process.env.PORT ?? 5000);
    const host = process.env.HOST ?? '0.0.0.0';

    server.listen({ port, host }, () => {
      logger.info({ port, host, env: process.env.NODE_ENV }, 'SkateHubba server ready');
    });

    const shutdown = (signal: NodeJS.Signals) => {
      logger.info({ signal }, 'Received shutdown signal');
      server.close((error) => {
        if (error) {
          logger.error({ err: error }, 'Error closing HTTP server');
          process.exit(1);
        }
        logger.info('HTTP server closed gracefully');
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);

    process.on('unhandledRejection', (reason) => {
      logger.error({ err: reason }, 'Unhandled promise rejection');
    });

    process.on('uncaughtException', (error) => {
      logger.fatal({ err: error }, 'Uncaught exception');
      process.exit(1);
    });
  } catch (error) {
    logger.fatal({ err: error }, 'Failed to start SkateHubba server');
    process.exit(1);
  }
};

startServer();
