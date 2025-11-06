import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';

let genAI: GoogleGenerativeAI | null = null;

if (env.googleApiKey) {
  genAI = new GoogleGenerativeAI(env.googleApiKey);
}

export interface GenerateJSONOptions {
  task: string;
  systemPrompt: string;
  payload: unknown;
  temperature?: number;
  maxRetries?: number;
}

export const generateJSON = async <T>(options: GenerateJSONOptions): Promise<T> => {
  const { task, systemPrompt, payload, temperature = 0.2, maxRetries = 2 } = options;
  const startTime = Date.now();

  if (!genAI) {
    throw new Error('Gemini client not initialized - GOOGLE_API_KEY missing');
  }

  const model = genAI.getGenerativeModel({
    model: env.geminiModel,
    generationConfig: {
      temperature,
      responseMimeType: 'application/json',
    },
  });

  const basePrompt = `TASK: ${task}\n\nDATA:\n${JSON.stringify(payload, null, 2)}\n\nRéponds en JSON strict selon le schéma défini.`;
  let userPrompt = basePrompt;

  let attempt = 0;
  let lastError: Error | null = null;

  while (attempt < maxRetries) {
    try {
      const result = await model.generateContent([
        { text: systemPrompt },
        { text: userPrompt },
      ]);

      const response = result.response;
      const text = response.text();
      const duration = Date.now() - startTime;

      // Estimate tokens and cost (Gemini 2.5 Flash pricing)
      const estimatedInputTokens = Math.ceil((systemPrompt.length + userPrompt.length) / 4);
      const estimatedOutputTokens = Math.ceil(text.length / 4);
      const totalTokens = estimatedInputTokens + estimatedOutputTokens;
      // Gemini 2.5 Flash: $0.075 per 1M input tokens, $0.30 per 1M output tokens
      const costUsd = (estimatedInputTokens * 0.075 + estimatedOutputTokens * 0.30) / 1_000_000;

      logger.debug('Gemini raw response', { task, text: text.substring(0, 200) });

      // Parse JSON
      let parsed: T;
      try {
        // Clean response text (remove markdown code blocks if present)
        let cleanText = text.trim();
        if (cleanText.startsWith('```json')) {
          cleanText = cleanText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        } else if (cleanText.startsWith('```')) {
          cleanText = cleanText.replace(/^```\s*/, '').replace(/\s*```$/, '');
        }
        
        // Handle empty responses
        if (!cleanText) {
          logger.error('Empty response from Gemini', { task, attempt });
          throw new Error('LLM returned empty response');
        }
        
        parsed = JSON.parse(cleanText) as T;
      } catch (parseError) {
        logger.warn('Failed to parse JSON response', { task, attempt, text, error: (parseError as Error).message });
        throw new Error(`LLM returned non-JSON response: ${(parseError as Error).message}`);
      }

      // Log performance metrics
      logger.performance('LLM generation completed', {
        duration_ms: duration,
        timestamp: new Date().toISOString(),
        task,
        tokens_estimated: totalTokens,
        cost_usd_estimated: parseFloat(costUsd.toFixed(6)),
      });

      return parsed;
    } catch (error) {
      lastError = error as Error;
      attempt++;
      logger.warn('Gemini generation failed', { task, attempt, error: lastError.message });

      if (attempt < maxRetries) {
        // Retry with stricter prompt
        userPrompt = `ERREUR: La réponse précédente n'était pas du JSON valide.\n\nRESPECTE STRICTEMENT le schéma JSON.\n\n${basePrompt}`;
        continue;
      }
    }
  }

  logger.error('Gemini generation failed after retries', { task, maxRetries });
  throw new Error(`LLM_UNAVAILABLE: ${lastError?.message || 'Unknown error'}`);
};
