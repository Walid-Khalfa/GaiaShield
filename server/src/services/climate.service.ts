import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { generateJSON } from '../llm/geminiClient.js';
import { getForecast } from './weather.tool.js';
import { hashPayload } from './hashing.js';
import { cacheService } from '../config/cache.js';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';
import type { ClimateRequest, ClimateResponse } from '../schemas/climate.js';
import { climateResponseSchema } from '../schemas/climate.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const MOCK_RESPONSE: ClimateResponse = {
  ok: true,
  task: 'climate_guard',
  risk_level: 'medium',
  findings: [
    {
      title: 'Vague de chaleur prévue J+3 à J+6',
      evidence: 'Températures maximales atteignant 38°C avec humidité faible',
      confidence: 0.85,
    },
    {
      title: 'Conditions sèches prolongées',
      evidence: 'Précipitations totales < 5mm sur 10 jours',
      confidence: 0.9,
    },
  ],
  recommendations: [
    {
      action: 'Planifier irrigation préventive pour cultures sensibles',
      impact: 'Réduction pertes de rendement de 15-25%',
      est_saving_usd: 1200,
    },
    {
      action: 'Ajuster horaires de travail (tôt matin/fin journée)',
      impact: 'Réduction risques santé travailleurs, productivité +10%',
      est_saving_usd: 800,
    },
    {
      action: 'Vérifier systèmes de refroidissement et backup électrique',
      impact: 'Éviter pertes stock périssable',
      est_saving_usd: 2500,
    },
  ],
  notes: 'Conditions climatiques défavorables nécessitant préparation immédiate. Prioriser protection des actifs critiques.',
};

export const analyzeClimate = async (request: ClimateRequest): Promise<ClimateResponse> => {
  const { inputs, constraints, locale } = request;

  // Demo mode
  if (env.isDemoMode) {
    logger.info('Climate analysis in DEMO mode');
    return MOCK_RESPONSE;
  }

  // Check cache (include locale in cache key)
  const cacheKey = hashPayload({ task: 'climate_guard', inputs, constraints, locale });
  const cached = cacheService.get(cacheKey);
  if (cached) {
    logger.info('Climate analysis cache hit', { cacheKey });
    return cached as ClimateResponse;
  }

  try {
    // Fetch weather forecast
    const forecast = await getForecast(inputs.lat, inputs.lon, inputs.horizonDays);

    // Load system prompt
    const promptPath = join(__dirname, '../llm/prompts/climateGuard.system.txt');
    const systemPrompt = await readFile(promptPath, 'utf-8');

    // Enrich payload with forecast and locale
    const enrichedPayload = {
      ...inputs,
      forecast,
      constraints,
      locale: locale || 'en',
    };

    // Generate analysis
    const response = await generateJSON<ClimateResponse>({
      task: 'climate_guard',
      systemPrompt,
      payload: enrichedPayload,
      temperature: constraints.cost_mode === 'quality' ? 0.3 : 0.2,
    });

    // Validate response
    const validated = climateResponseSchema.parse(response);

    // Cache result
    cacheService.set(cacheKey, validated);

    logger.info('Climate analysis completed', { lat: inputs.lat, lon: inputs.lon });
    return validated;
  } catch (error) {
    logger.error('Climate analysis failed', { error });
    throw error;
  }
};
