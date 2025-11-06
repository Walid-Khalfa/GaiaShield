import { z } from 'zod';
import { baseRequestSchema, baseResponseSchema } from './common.js';

export const cyberEventSchema = z.object({
  id: z.string(),
  type: z.enum(['email', 'url', 'log']),
  content: z.string(),
  metadata: z.record(z.unknown()).optional(),
});

export const cyberInputsSchema = z.object({
  events: z.array(cyberEventSchema).min(1),
});

export const cyberRequestSchema = baseRequestSchema.extend({
  inputs: cyberInputsSchema,
});

export const cyberClassificationSchema = z.enum(['safe', 'suspicious', 'malicious']);

export const cyberResponseSchema = baseResponseSchema.extend({
  task: z.literal('cyberprotect'),
  actions: z.array(
    z.object({
      type: z.enum(['block', 'quarantine', 'ignore', 'alert']),
      reason: z.string(),
      event_id: z.string().optional(),
      classification: cyberClassificationSchema.optional(),
    })
  ),
  findings: z.array(
    z.object({
      title: z.string(),
      evidence: z.string(),
      confidence: z.number().min(0).max(1),
    })
  ),
});

export type CyberInputs = z.infer<typeof cyberInputsSchema>;
export type CyberRequest = z.infer<typeof cyberRequestSchema>;
export type CyberResponse = z.infer<typeof cyberResponseSchema>;
