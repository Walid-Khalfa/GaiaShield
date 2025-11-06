import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logger } from '../config/logger.js';
import { createErrorResponse } from '../schemas/responses.js';

const isZodLikeError = (error: unknown): error is ZodError => {
  if (error instanceof ZodError) {
    return true;
  }
  if (error && typeof error === 'object' && 'issues' in error) {
    const issues = (error as { issues?: unknown }).issues;
    return Array.isArray(issues);
  }
  return false;
};

const getErrorMessage = (error: unknown): string => {
  if (typeof error === 'string') {
    return error;
  }
  if (error && typeof error === 'object' && 'message' in error && typeof (error as { message: unknown }).message === 'string') {
    return (error as { message: string }).message;
  }
  return 'Unknown error';
};

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  void _next;
  const message = getErrorMessage(error);
  const stack = error instanceof Error ? error.stack : undefined;
  logger.error('Request error', { error: message, stack });

  // Zod validation errors
  if (isZodLikeError(error)) {
    const zodError = error instanceof ZodError ? error : new ZodError((error as { issues: ZodError['issues'] }).issues);
    return res.status(400).json(
      createErrorResponse('VALIDATION_ERROR', {
        issues: zodError.errors.map((e) => ({
          path: e.path.join('.'),
          message: e.message,
        })),
      })
    );
  }

  // LLM unavailable
  if (message.includes('LLM_UNAVAILABLE')) {
    return res.status(502).json(createErrorResponse('LLM_UNAVAILABLE', message));
  }

  // Generic error
  return res.status(500).json(createErrorResponse('INTERNAL_ERROR', message));
};
