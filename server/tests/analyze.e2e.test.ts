import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import type { Express } from 'express';

let app: Express;

beforeAll(async () => {
  // Force demo mode for deterministic tests
  delete process.env.GOOGLE_API_KEY;
  delete process.env.OPENWEATHER_API_KEY;
  process.env.FORCE_DEMO_MODE = 'true';
  process.env.PORT = '0';

  const serverModule = await import('../src/server.js');
  app = serverModule.default;
});

describe('Analyze API E2E Tests', () => {

  describe('POST /api/analyze/climate_guard', () => {
    it('should return valid climate analysis', async () => {
      const payload = {
        inputs: {
          lat: 14.7167,
          lon: -17.4677,
          horizonDays: 10,
          sector: 'agri',
        },
        locale: 'fr-TN',
        constraints: {
          max_recos: 5,
          tone: 'concise',
          cost_mode: 'cheap_fast',
        },
      };

      const response = await request(app)
        .post('/api/analyze/climate_guard')
        .send(payload)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('ok', true);
      expect(response.body).toHaveProperty('task', 'climate_guard');
      expect(response.body).toHaveProperty('risk_level');
      expect(response.body).toHaveProperty('findings');
      expect(response.body).toHaveProperty('recommendations');
      expect(Array.isArray(response.body.findings)).toBe(true);
      expect(Array.isArray(response.body.recommendations)).toBe(true);
    });

    it('should reject invalid latitude', async () => {
      const payload = {
        inputs: {
          lat: 95,
          lon: -17.4677,
          horizonDays: 10,
          sector: 'agri',
        },
      };

      const response = await request(app)
        .post('/api/analyze/climate_guard')
        .send(payload)
        .expect(400);

      expect(response.body).toHaveProperty('ok', false);
      expect(response.body).toHaveProperty('error', 'VALIDATION_ERROR');
    });
  });

  describe('POST /api/analyze/business_shield', () => {
    it('should return valid business analysis', async () => {
      const payload = {
        inputs: {
          sales: [{ date: '2025-01-01', qty: 100, revenue: 5000 }],
          stock: [{ sku: 'PROD-001', qty: 50, leadDays: 14 }],
          suppliers: [{ name: 'Supplier A', onTimeRate: 0.9, region: 'Dakar' }],
        },
        locale: 'fr-TN',
        constraints: {},
      };

      const response = await request(app)
        .post('/api/analyze/business_shield')
        .send(payload)
        .expect(200);

      expect(response.body).toHaveProperty('ok', true);
      expect(response.body).toHaveProperty('task', 'business_shield');
      expect(response.body).toHaveProperty('score');
      expect(response.body).toHaveProperty('risk_level');
      expect(response.body.score).toBeGreaterThanOrEqual(0);
      expect(response.body.score).toBeLessThanOrEqual(100);
    });
  });

  describe('POST /api/analyze/cyberprotect', () => {
    it('should return valid cyber analysis', async () => {
      const payload = {
        inputs: {
          events: [
            {
              id: 'evt_001',
              type: 'email',
              content: 'URGENT: Click here to claim your prize!',
              metadata: { from: 'scam@example.com' },
            },
          ],
        },
        locale: 'fr-TN',
        constraints: {},
      };

      const response = await request(app)
        .post('/api/analyze/cyberprotect')
        .send(payload)
        .expect(200);

      expect(response.body).toHaveProperty('ok', true);
      expect(response.body).toHaveProperty('task', 'cyberprotect');
      expect(response.body).toHaveProperty('actions');
      expect(Array.isArray(response.body.actions)).toBe(true);
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health').expect(200);

      expect(response.body).toHaveProperty('ok', true);
      expect(response.body).toHaveProperty('service', 'gaiashield-api');
    });
  });
});
