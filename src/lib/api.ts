const API_URL = import.meta.env.VITE_API_URL || '/api';

// API cache with TTL
const apiCache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCacheKey(endpoint: string, body: unknown): string {
  return `${endpoint}:${JSON.stringify(body)}`;
}

function getFromCache<T>(key: string): T | null {
  const cached = apiCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data as T;
  }
  apiCache.delete(key);
  return null;
}

function setCache(key: string, data: unknown): void {
  apiCache.set(key, { data, timestamp: Date.now() });
  // Limit cache size
  if (apiCache.size > 50) {
    const firstKey = apiCache.keys().next().value;
    if (firstKey !== undefined) {
      apiCache.delete(firstKey);
    }
  }
}

export interface ClimateInputs {
  lat: number;
  lon: number;
  horizonDays: number;
  sector: 'retail' | 'agri' | 'logistics' | 'manufacturing' | 'services';
  context?: string;
}

export interface BusinessInputs {
  sales: Array<{ date: string; qty: number; revenue: number }>;
  stock: Array<{ sku: string; qty: number; leadDays: number }>;
  suppliers: Array<{ name: string; onTimeRate: number; region: string }>;
  energyCostPerKwh?: number;
  cashOnHand?: number;
}

export interface CyberInputs {
  events: Array<{
    id: string;
    type: 'email' | 'url' | 'log';
    content: string;
    metadata?: Record<string, unknown>;
  }>;
}

export interface AnalyzeRequest<T> {
  inputs: T;
  locale?: string;
  constraints?: {
    max_recos?: number;
    tone?: 'concise' | 'detailed' | 'technical';
    cost_mode?: 'cheap_fast' | 'balanced' | 'quality';
  };
}

export interface Finding {
  title: string;
  evidence: string;
  confidence: number;
}

export interface Recommendation {
  action: string;
  impact: string;
  est_saving_usd: number;
}

export interface Action {
  type: 'block' | 'quarantine' | 'ignore' | 'optimize' | 'alert';
  reason: string;
  event_id?: string;
  classification?: 'safe' | 'suspicious' | 'malicious';
}

export interface BaseResponse {
  ok: boolean;
  task: string;
  risk_level?: 'low' | 'medium' | 'high' | 'unknown';
  findings?: Finding[] | string[];
  recommendations?: Recommendation[] | string[];
  score?: number;
  actions?: Action[];
  notes?: string;
  confidence?: number;
}

export interface ClimateResponse extends BaseResponse {
  task: 'climate_guard';
  risk_level: 'low' | 'medium' | 'high' | 'unknown';
  findings: Finding[];
  recommendations: Recommendation[];
}

export interface BusinessResponse extends BaseResponse {
  task: 'business_shield';
  score: number;
  risk_level: 'low' | 'medium' | 'high' | 'unknown';
  findings: Finding[];
  recommendations: Recommendation[];
}

export interface CyberResponse extends BaseResponse {
  task: 'cyberprotect';
  actions: Action[];
  findings: Finding[];
}

export const analyzeClimate = async (
  request: Partial<AnalyzeRequest<ClimateInputs>> & { inputs: ClimateInputs }
): Promise<ClimateResponse> => {
  const fullRequest: AnalyzeRequest<ClimateInputs> = {
    inputs: request.inputs,
    locale: request.locale || 'fr-FR',
    constraints: request.constraints,
  };
  const cacheKey = getCacheKey('climate_guard', fullRequest);
  const cached = getFromCache<ClimateResponse>(cacheKey);
  if (cached) return cached;

  const response = await fetch(`${API_URL}/api/analyze/climate_guard`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(fullRequest),
  });

  if (!response.ok) {
    let errorMessage = 'Climate analysis failed';
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorData.message || errorMessage;
    } catch {
      // If JSON parsing fails, use status text
      errorMessage = `${errorMessage} (${response.status}: ${response.statusText})`;
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();
  setCache(cacheKey, data);
  return data;
};

export const analyzeBusiness = async (
  request: Partial<AnalyzeRequest<BusinessInputs>> & { inputs: BusinessInputs }
): Promise<BusinessResponse> => {
  const fullRequest: AnalyzeRequest<BusinessInputs> = {
    inputs: request.inputs,
    locale: request.locale || 'fr-FR',
    constraints: request.constraints,
  };
  const cacheKey = getCacheKey('business_shield', fullRequest);
  const cached = getFromCache<BusinessResponse>(cacheKey);
  if (cached) return cached;

  const response = await fetch(`${API_URL}/api/analyze/business_shield`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(fullRequest),
  });

  if (!response.ok) {
    let errorMessage = 'Business analysis failed';
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorData.message || errorMessage;
    } catch {
      errorMessage = `${errorMessage} (${response.status}: ${response.statusText})`;
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();
  setCache(cacheKey, data);
  return data;
};

export const analyzeCyber = async (
  request: Partial<AnalyzeRequest<CyberInputs>> & { inputs: CyberInputs }
): Promise<CyberResponse> => {
  const fullRequest: AnalyzeRequest<CyberInputs> = {
    inputs: request.inputs,
    locale: request.locale || 'fr-FR',
    constraints: request.constraints,
  };
  const cacheKey = getCacheKey('cyberprotect', fullRequest);
  const cached = getFromCache<CyberResponse>(cacheKey);
  if (cached) return cached;

  const response = await fetch(`${API_URL}/api/analyze/cyberprotect`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(fullRequest),
  });

  if (!response.ok) {
    let errorMessage = 'Cyber analysis failed';
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorData.message || errorMessage;
    } catch {
      errorMessage = `${errorMessage} (${response.status}: ${response.statusText})`;
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();
  setCache(cacheKey, data);
  return data;
};
