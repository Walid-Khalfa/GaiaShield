import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { generateJSON } from '../llm/geminiClient.js';
import { hashPayload } from './hashing.js';
import { cacheService } from '../config/cache.js';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';
import type { BusinessRequest, BusinessResponse } from '../schemas/business.js';
import { businessResponseSchema } from '../schemas/business.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const MOCK_RESPONSE: BusinessResponse = {
  ok: true,
  task: 'business_shield',
  score: 62,
  risk_level: 'medium',
  findings: [
    {
      title: 'Dépendance excessive à un fournisseur principal',
      evidence: '60% des approvisionnements via un seul fournisseur (onTimeRate: 0.75)',
      confidence: 0.9,
    },
    {
      title: 'Rotation stock sous-optimale',
      evidence: 'Délais moyens de réapprovisionnement: 18 jours, stock actuel: 45 jours',
      confidence: 0.85,
    },
    {
      title: 'Tendance ventes en baisse',
      evidence: 'Revenus -12% sur les 10 derniers jours vs période précédente',
      confidence: 0.75,
    },
  ],
  recommendations: [
    {
      action: 'Diversifier fournisseurs: identifier 2 sources alternatives pour SKU critiques',
      impact: 'Réduction risque rupture de 40%, amélioration négociation prix',
      est_saving_usd: 3500,
    },
    {
      action: 'Optimiser niveaux de stock: réduire à 30 jours pour produits à rotation rapide',
      impact: 'Libération trésorerie, réduction coûts stockage 25%',
      est_saving_usd: 2800,
    },
    {
      action: 'Automatiser alertes de réapprovisionnement basées sur seuils dynamiques',
      impact: 'Éviter ruptures stock, réduction temps gestion 30%',
      est_saving_usd: 1500,
    },
  ],
  notes: 'Score de résilience moyen (62/100). Priorité: diversification supply chain et optimisation trésorerie.',
};

export const analyzeBusiness = async (request: BusinessRequest): Promise<BusinessResponse> => {
  const { inputs, constraints, locale } = request;

  // Demo mode
  if (env.isDemoMode) {
    logger.info('Business analysis in DEMO mode');
    return MOCK_RESPONSE;
  }

  // Check cache (include locale in cache key)
  const cacheKey = hashPayload({ task: 'business_shield', inputs, constraints, locale });
  const cached = cacheService.get(cacheKey);
  if (cached) {
    logger.info('Business analysis cache hit', { cacheKey });
    return cached as BusinessResponse;
  }

  try {
    // Load system prompt
    const promptPath = join(__dirname, '../llm/prompts/businessShield.system.txt');
    const systemPrompt = await readFile(promptPath, 'utf-8');

    // Generate analysis
    const response = await generateJSON<BusinessResponse>({
      task: 'business_shield',
      systemPrompt,
      payload: { ...inputs, constraints, locale: locale || 'en' },
      temperature: constraints.cost_mode === 'quality' ? 0.3 : 0.2,
    });

    // Validate response
    const validated = businessResponseSchema.parse(response);

    // Cache result
    cacheService.set(cacheKey, validated);

    logger.info('Business analysis completed', { score: validated.score });
    return validated;
  } catch (error) {
    logger.error('Business analysis failed', { error });
    throw error;
  }
};
