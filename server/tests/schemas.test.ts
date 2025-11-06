import { describe, it, expect } from 'vitest';
import { climateInputsSchema } from '../src/schemas/climate.js';
import { businessInputsSchema } from '../src/schemas/business.js';
import { cyberInputsSchema } from '../src/schemas/cyber.js';

describe('Climate Schema Validation', () => {
  it('should validate correct climate inputs', () => {
    const valid = {
      lat: 14.7167,
      lon: -17.4677,
      horizonDays: 10,
      sector: 'agri',
    };
    expect(() => climateInputsSchema.parse(valid)).not.toThrow();
  });

  it('should reject invalid latitude', () => {
    const invalid = {
      lat: 95,
      lon: -17.4677,
      horizonDays: 10,
      sector: 'agri',
    };
    expect(() => climateInputsSchema.parse(invalid)).toThrow();
  });

  it('should reject invalid sector', () => {
    const invalid = {
      lat: 14.7167,
      lon: -17.4677,
      horizonDays: 10,
      sector: 'invalid_sector',
    };
    expect(() => climateInputsSchema.parse(invalid)).toThrow();
  });
});

describe('Business Schema Validation', () => {
  it('should validate correct business inputs', () => {
    const valid = {
      sales: [{ date: '2025-01-01', qty: 100, revenue: 5000 }],
      stock: [{ sku: 'PROD-001', qty: 50, leadDays: 14 }],
      suppliers: [{ name: 'Supplier A', onTimeRate: 0.9, region: 'Dakar' }],
    };
    expect(() => businessInputsSchema.parse(valid)).not.toThrow();
  });

  it('should reject invalid date format', () => {
    const invalid = {
      sales: [{ date: '01/01/2025', qty: 100, revenue: 5000 }],
      stock: [{ sku: 'PROD-001', qty: 50, leadDays: 14 }],
      suppliers: [{ name: 'Supplier A', onTimeRate: 0.9, region: 'Dakar' }],
    };
    expect(() => businessInputsSchema.parse(invalid)).toThrow();
  });

  it('should reject onTimeRate > 1', () => {
    const invalid = {
      sales: [{ date: '2025-01-01', qty: 100, revenue: 5000 }],
      stock: [{ sku: 'PROD-001', qty: 50, leadDays: 14 }],
      suppliers: [{ name: 'Supplier A', onTimeRate: 1.5, region: 'Dakar' }],
    };
    expect(() => businessInputsSchema.parse(invalid)).toThrow();
  });
});

describe('Cyber Schema Validation', () => {
  it('should validate correct cyber inputs', () => {
    const valid = {
      events: [
        {
          id: 'evt_001',
          type: 'email',
          content: 'Test email content',
          metadata: { from: 'test@example.com' },
        },
      ],
    };
    expect(() => cyberInputsSchema.parse(valid)).not.toThrow();
  });

  it('should reject invalid event type', () => {
    const invalid = {
      events: [
        {
          id: 'evt_001',
          type: 'invalid_type',
          content: 'Test content',
        },
      ],
    };
    expect(() => cyberInputsSchema.parse(invalid)).toThrow();
  });

  it('should accept events without metadata', () => {
    const valid = {
      events: [
        {
          id: 'evt_001',
          type: 'url',
          content: 'https://example.com',
        },
      ],
    };
    expect(() => cyberInputsSchema.parse(valid)).not.toThrow();
  });
});
