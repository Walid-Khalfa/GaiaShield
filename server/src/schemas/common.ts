import { z } from 'zod';

export const localeSchema = z.string().default('fr-TN');

export const constraintsSchema = z
  .object({
    max_recos: z.number().int().min(1).max(10).default(5),
    tone: z.enum(['concise', 'detailed', 'technical']).default('concise'),
    cost_mode: z.enum(['cheap_fast', 'balanced', 'quality']).default('cheap_fast'),
  })
  .default({});

export const baseRequestSchema = z.object({
  locale: localeSchema,
  constraints: constraintsSchema,
});

export const riskLevelSchema = z.enum(['low', 'medium', 'high', 'unknown']);

export const findingSchema = z.object({
  title: z.string(),
  evidence: z.string(),
  confidence: z.number().min(0).max(1),
});

export const recommendationSchema = z.object({
  action: z.string(),
  impact: z.string(),
  est_saving_usd: z.number().min(0),
});

export const actionSchema = z.object({
  type: z.enum(['block', 'quarantine', 'ignore', 'optimize', 'alert']),
  reason: z.string(),
});

export const baseResponseSchema = z.object({
  ok: z.boolean(),
  task: z.string(),
  risk_level: riskLevelSchema.optional(),
  findings: z.array(findingSchema).optional(),
  recommendations: z.array(recommendationSchema).optional(),
  score: z.number().int().min(0).max(100).optional(),
  actions: z.array(actionSchema).optional(),
  notes: z.string().optional(),
});
