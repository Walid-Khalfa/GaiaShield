import { z } from 'zod';
import { baseRequestSchema, baseResponseSchema } from './common.js';

export const salesEntrySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  qty: z.number().int().min(0),
  revenue: z.number().min(0),
});

export const stockEntrySchema = z.object({
  sku: z.string(),
  qty: z.number().int().min(0),
  leadDays: z.number().int().min(0),
});

export const supplierEntrySchema = z.object({
  name: z.string(),
  onTimeRate: z.number().min(0).max(1),
  region: z.string(),
});

export const businessInputsSchema = z.object({
  sales: z.array(salesEntrySchema).min(1),
  stock: z.array(stockEntrySchema).min(1),
  suppliers: z.array(supplierEntrySchema).min(1),
  energyCostPerKwh: z.number().min(0).optional(),
  cashOnHand: z.number().min(0).optional(),
});

export const businessRequestSchema = baseRequestSchema.extend({
  inputs: businessInputsSchema,
});

export const businessResponseSchema = baseResponseSchema.extend({
  task: z.literal('business_shield'),
  score: z.number().int().min(0).max(100),
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

export type BusinessInputs = z.infer<typeof businessInputsSchema>;
export type BusinessRequest = z.infer<typeof businessRequestSchema>;
export type BusinessResponse = z.infer<typeof businessResponseSchema>;
