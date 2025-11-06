import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { generateJSON } from '../llm/geminiClient.js';
import { hashPayload } from './hashing.js';
import { cacheService } from '../config/cache.js';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';
import type { CyberRequest, CyberResponse } from '../schemas/cyber.js';
import { cyberResponseSchema } from '../schemas/cyber.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const MOCK_RESPONSE: CyberResponse = {
  ok: true,
  task: 'cyberprotect',
  actions: [
    {
      type: 'block',
      reason: 'Email de phishing détecté: expéditeur usurpé, urgence artificielle, lien suspect',
      event_id: 'evt_001',
      classification: 'malicious',
    },
    {
      type: 'quarantine',
      reason: 'URL suspecte: domaine récent, HTTPS manquant, redirection multiple',
      event_id: 'evt_002',
      classification: 'suspicious',
    },
    {
      type: 'ignore',
      reason: 'Email légitime: expéditeur vérifié, contenu cohérent',
      event_id: 'evt_003',
      classification: 'safe',
    },
  ],
  findings: [
    {
      title: 'Tentative de phishing par usurpation d\'identité',
      evidence: 'Domaine expéditeur: paypa1.com (typosquatting), demande urgente de mise à jour compte',
      confidence: 0.95,
    },
    {
      title: 'URL potentiellement malveillante',
      evidence: 'Domaine enregistré il y a 3 jours, hébergement suspect, pas de HTTPS',
      confidence: 0.75,
    },
  ],
  notes: '2 menaces détectées sur 10 événements analysés. Recommandation: formation utilisateurs sur phishing.',
};

export const analyzeCyber = async (request: CyberRequest): Promise<CyberResponse> => {
  const { inputs, constraints, locale } = request;

  // Demo mode
  if (env.isDemoMode) {
    logger.info('Cyber analysis in DEMO mode');
    return MOCK_RESPONSE;
  }

  // Check cache (include locale in cache key)
  const cacheKey = hashPayload({ task: 'cyberprotect', inputs, constraints, locale });
  const cached = cacheService.get(cacheKey);
  if (cached) {
    logger.info('Cyber analysis cache hit', { cacheKey });
    return cached as CyberResponse;
  }

  try {
    // Load system prompt
    const promptPath = join(__dirname, '../llm/prompts/cyberProtect.system.txt');
    const systemPrompt = await readFile(promptPath, 'utf-8');

    // Generate analysis
    const response = await generateJSON<CyberResponse>({
      task: 'cyberprotect',
      systemPrompt,
      payload: { ...inputs, constraints, locale: locale || 'en' },
      temperature: constraints.cost_mode === 'quality' ? 0.3 : 0.2,
    });

    // Validate response
    const validated = cyberResponseSchema.parse(response);

    // Cache result
    cacheService.set(cacheKey, validated);

    logger.info('Cyber analysis completed', { eventsCount: inputs.events.length });
    return validated;
  } catch (error) {
    logger.error('Cyber analysis failed', { error });
    throw error;
  }
};
