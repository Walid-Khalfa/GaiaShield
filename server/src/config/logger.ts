type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface PerformanceMetrics {
  duration_ms: number;
  timestamp: string;
  task?: string;
  tokens_estimated?: number;
  cost_usd_estimated?: number;
}

const sanitize = (data: unknown): unknown => {
  if (typeof data === 'string') {
    return data.replace(/api[_-]?key|token|secret|password/gi, '[REDACTED]');
  }
  if (Array.isArray(data)) {
    return data.map(sanitize);
  }
  if (data && typeof data === 'object') {
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      if (/api[_-]?key|token|secret|password/i.test(key)) {
        sanitized[key] = '[REDACTED]';
      } else {
        sanitized[key] = sanitize(value);
      }
    }
    return sanitized;
  }
  return data;
};

const log = (level: LogLevel, message: string, meta?: unknown) => {
  const timestamp = new Date().toISOString();
  const sanitizedMeta = meta ? sanitize(meta) : undefined;
  const logEntry: Record<string, unknown> = {
    timestamp,
    level,
    message,
  };
  if (sanitizedMeta !== undefined) {
    logEntry.meta = sanitizedMeta;
  }
  console.log(JSON.stringify(logEntry));
};

export const logger = {
  info: (message: string, meta?: unknown) => log('info', message, meta),
  warn: (message: string, meta?: unknown) => log('warn', message, meta),
  error: (message: string, meta?: unknown) => log('error', message, meta),
  debug: (message: string, meta?: unknown) => log('debug', message, meta),
  
  performance: (message: string, metrics: PerformanceMetrics) => {
    log('info', message, {
      metrics,
      type: 'performance',
    });
  },
};
