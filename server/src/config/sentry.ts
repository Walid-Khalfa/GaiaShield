import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import { env } from './env.js';

export function initSentry() {
  if (!env.SENTRY_DSN) {
    console.log('⚠️  Sentry DSN not configured - error tracking disabled');
    return;
  }

  Sentry.init({
    dsn: env.SENTRY_DSN,
    environment: env.SENTRY_ENVIRONMENT || env.nodeEnv,
    tracesSampleRate: env.SENTRY_TRACES_SAMPLE_RATE || 0.1,
    profilesSampleRate: 0.1,
    integrations: [
      nodeProfilingIntegration(),
      Sentry.httpIntegration(),
      Sentry.expressIntegration(),
    ],
    beforeSend(event) {
      // Sanitize sensitive data
      if (event.request?.headers) {
        delete event.request.headers['authorization'];
        delete event.request.headers['cookie'];
      }
      
      // Add custom context
      if (event.extra) {
        event.extra.timestamp = new Date().toISOString();
      }
      
      return event;
    },
  });

  console.log('✅ Sentry initialized for error tracking');
}

export { Sentry };
