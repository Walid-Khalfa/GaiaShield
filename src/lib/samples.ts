import type { ClimateInputs, BusinessInputs, CyberInputs } from './api';

export const climateSample: ClimateInputs = {
  lat: 48.8566,
  lon: 2.3522,
  horizonDays: 10,
  sector: 'agri',
};

export const businessSample: BusinessInputs = {
  sales: [
    { date: '2025-01-01', qty: 120, revenue: 3600 },
    { date: '2025-01-02', qty: 95, revenue: 2850 },
    { date: '2025-01-03', qty: 110, revenue: 3300 },
    { date: '2025-01-04', qty: 88, revenue: 2640 },
    { date: '2025-01-05', qty: 102, revenue: 3060 },
    { date: '2025-01-06', qty: 78, revenue: 2340 },
    { date: '2025-01-07', qty: 92, revenue: 2760 },
    { date: '2025-01-08', qty: 105, revenue: 3150 },
    { date: '2025-01-09', qty: 85, revenue: 2550 },
    { date: '2025-01-10', qty: 98, revenue: 2940 },
  ],
  stock: [
    { sku: 'PROD-001', qty: 450, leadDays: 14 },
    { sku: 'PROD-002', qty: 220, leadDays: 21 },
    { sku: 'PROD-003', qty: 180, leadDays: 10 },
    { sku: 'PROD-004', qty: 95, leadDays: 28 },
    { sku: 'PROD-005', qty: 310, leadDays: 18 },
  ],
  suppliers: [
    { name: 'Fournisseur A', onTimeRate: 0.92, region: 'Dakar' },
    { name: 'Fournisseur B', onTimeRate: 0.75, region: 'Thiès' },
    { name: 'Fournisseur C', onTimeRate: 0.88, region: 'Saint-Louis' },
  ],
  energyCostPerKwh: 0.15,
  cashOnHand: 45000,
};

export const cyberSample: CyberInputs = {
  events: [
    {
      id: 'evt_001',
      type: 'email',
      content:
        "URGENT: Votre compte PayPal a été suspendu. Cliquez ici pour réactiver: http://paypa1-secure.tk/login",
      metadata: {
        from: 'security@paypa1.com',
        subject: 'Action requise immédiatement',
      },
    },
    {
      id: 'evt_002',
      type: 'url',
      content: 'http://free-iphone-winner.xyz/claim?ref=sms2025',
      metadata: {
        source: 'SMS inconnu',
      },
    },
    {
      id: 'evt_003',
      type: 'email',
      content: 'Bonjour, voici le rapport mensuel demandé en pièce jointe.',
      metadata: {
        from: 'comptabilite@entreprise-legitime.sn',
        subject: 'Rapport janvier 2025',
      },
    },
  ],
};
