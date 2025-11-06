import { z } from 'zod';

export const errorResponseSchema = z.object({
  ok: z.literal(false),
  error: z.string(),
  details: z.unknown().optional(),
});

export type ErrorResponse = z.infer<typeof errorResponseSchema>;

export const createErrorResponse = (
  error: string,
  details?: unknown
): ErrorResponse => ({
  ok: false,
  error,
  details,
});
