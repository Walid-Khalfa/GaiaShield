import express, { type Application, type RequestHandler, type ErrorRequestHandler } from 'express';
import compression from 'compression';
import swaggerUi from 'swagger-ui-express';
import { env, validateEnv } from './config/env.js';
import { logger } from './config/logger.js';
import { corsMiddleware } from './middleware/cors.js';
import { errorHandler } from './middleware/errorHandler.js';
import { analyzeRouter } from './routes/analyze.router.js';
import { swaggerSpec } from './config/swagger.js';
import { initSentry, Sentry } from './config/sentry.js';

validateEnv();
initSentry();

const app: Application = express();

const sentryHandlers = Sentry as typeof Sentry & {
  Handlers?: {
    requestHandler: () => RequestHandler;
    tracingHandler: () => RequestHandler;
    errorHandler: () => ErrorRequestHandler;
  };
};

// Sentry request handler (must be first)
if (env.SENTRY_DSN && sentryHandlers.Handlers) {
  app.use(sentryHandlers.Handlers.requestHandler());
  app.use(sentryHandlers.Handlers.tracingHandler());
}

// Middleware
app.use(compression()); // Enable gzip compression
app.use(express.json({ limit: '10mb' }));
app.use(corsMiddleware);

/**
 * @openapi
 * /health:
 *   get:
 *     tags:
 *       - Health
 *     summary: Health check endpoint
 *     description: Returns the current status of the API
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 service:
 *                   type: string
 *                   example: gaiashield-api
 *                 mode:
 *                   type: string
 *                   enum: [demo, production]
 *                   example: production
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: 2024-01-15T10:30:00.000Z
 */
app.get('/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'gaiashield-api',
    mode: env.isDemoMode ? 'demo' : 'production',
    timestamp: new Date().toISOString(),
  });
});

// Swagger documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'GaiaShield API Documentation',
}));

// Routes
app.use('/api/analyze', analyzeRouter);

// Sentry error handler (must be before other error handlers)
if (env.SENTRY_DSN && sentryHandlers.Handlers) {
  app.use(sentryHandlers.Handlers.errorHandler());
}

// Error handler (must be last)
app.use(errorHandler);

const server = app.listen(env.port, () => {
  logger.info('GaiaShield API started', {
    port: env.port,
    mode: env.nodeEnv,
    demoMode: env.isDemoMode,
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

export default app;
