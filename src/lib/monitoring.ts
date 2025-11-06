import * as Sentry from '@sentry/react';
import posthog from 'posthog-js';

// Sentry configuration
export function initSentry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  
  if (!dsn) {
    console.log('⚠️  Sentry DSN not configured - error tracking disabled');
    return;
  }

  Sentry.init({
    dsn,
    environment: import.meta.env.VITE_SENTRY_ENVIRONMENT || import.meta.env.MODE,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    beforeSend(event, hint) {
      // Filter out non-critical errors
      if (event.exception) {
        const error = hint.originalException;
        if (error instanceof Error) {
          // Ignore network errors in development
          if (import.meta.env.DEV && error.message.includes('fetch')) {
            return null;
          }
        }
      }
      return event;
    },
  });

  console.log('✅ Sentry initialized for error tracking');
}

// PostHog configuration
export function initPostHog() {
  const key = import.meta.env.VITE_POSTHOG_KEY;
  const host = import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com';

  if (!key) {
    console.log('⚠️  PostHog key not configured - analytics disabled');
    return;
  }

  posthog.init(key, {
    api_host: host,
    autocapture: true,
    capture_pageview: true,
    capture_pageleave: true,
    session_recording: {
      maskAllInputs: false,
      maskInputOptions: {
        password: true,
      },
    },
    loaded: (posthog) => {
      if (import.meta.env.DEV) {
        posthog.opt_out_capturing();
        console.log('⚠️  PostHog disabled in development mode');
      } else {
        console.log('✅ PostHog initialized for analytics');
      }
    },
  });
}

// Analytics tracking helpers
export const analytics = {
  trackModuleAnalysis: (module: string, duration: number, success: boolean) => {
    if (!import.meta.env.VITE_POSTHOG_KEY) return;
    
    posthog.capture('module_analysis', {
      module,
      duration_ms: duration,
      success,
      timestamp: new Date().toISOString(),
    });
  },

  trackPDFExport: (modules: string[]) => {
    if (!import.meta.env.VITE_POSTHOG_KEY) return;
    
    posthog.capture('pdf_export', {
      modules,
      timestamp: new Date().toISOString(),
    });
  },

  trackLanguageChange: (language: string) => {
    if (!import.meta.env.VITE_POSTHOG_KEY) return;
    
    posthog.capture('language_change', {
      language,
      timestamp: new Date().toISOString(),
    });
  },

  trackThemeChange: (theme: string) => {
    if (!import.meta.env.VITE_POSTHOG_KEY) return;
    
    posthog.capture('theme_change', {
      theme,
      timestamp: new Date().toISOString(),
    });
  },

  trackCSVUpload: (module: string, rowCount: number) => {
    if (!import.meta.env.VITE_POSTHOG_KEY) return;
    
    posthog.capture('csv_upload', {
      module,
      row_count: rowCount,
      timestamp: new Date().toISOString(),
    });
  },

  identifyUser: (userId: string, traits?: Record<string, unknown>) => {
    if (!import.meta.env.VITE_POSTHOG_KEY) return;
    
    posthog.identify(userId, traits);
  },
};

// Error tracking helpers
export const errorTracking = {
  captureException: (error: Error, context?: Record<string, unknown>) => {
    console.error('Error captured:', error, context);
    
    if (import.meta.env.VITE_SENTRY_DSN) {
      Sentry.captureException(error, {
        extra: context,
      });
    }
  },

  captureMessage: (message: string, level: 'info' | 'warning' | 'error' = 'info', context?: Record<string, unknown>) => {
    console.log(`[${level.toUpperCase()}] ${message}`, context);
    
    if (import.meta.env.VITE_SENTRY_DSN) {
      Sentry.captureMessage(message, {
        level,
        extra: context,
      });
    }
  },

  setUser: (user: { id: string; email?: string; username?: string }) => {
    if (import.meta.env.VITE_SENTRY_DSN) {
      Sentry.setUser(user);
    }
  },

  addBreadcrumb: (message: string, category: string, data?: Record<string, unknown>) => {
    if (import.meta.env.VITE_SENTRY_DSN) {
      Sentry.addBreadcrumb({
        message,
        category,
        data,
        level: 'info',
      });
    }
  },
};

export { Sentry, posthog };
