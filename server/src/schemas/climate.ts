import { z } from 'zod';
import { baseRequestSchema, baseResponseSchema } from './common.js';

export const climateInputsSchema = z.object({
  lat: z.number().min(-90).max(90),
  lon: z.number().min(-180).max(180),
  horizonDays: z.number().int().min(1).max(10),
  sector: z.enum(['retail', 'agri', 'logistics', 'manufacturing', 'services']),
  context: z.string().optional(),
});

export const climateRequestSchema = baseRequestSchema.extend({
  inputs: climateInputsSchema,
});

export const climateResponseSchema = baseResponseSchema.extend({
  task: z.literal('climate_guard'),
  risk_level: z.enum(['low', 'medium', 'high', 'unknown']),
  findings: z.array(
    z.object({
      title: z.string(),
      evidence: z.string(),
      confidence: z.number().min(0).max(1),
    })
  ),
  recommendations: z.array(
    z.object({
      action: z.string(),
      impact: z.string(),
      est_saving_usd: z.number().min(0),
    })
  ),
});

export type ClimateInputs = z.infer<typeof climateInputsSchema>;
export type ClimateRequest = z.infer<typeof climateRequestSchema>;
export type ClimateResponse = z.infer<typeof climateResponseSchema>;
