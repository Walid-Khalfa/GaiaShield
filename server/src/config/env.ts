import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  googleApiKey: process.env.GOOGLE_API_KEY || '',
  geminiModel: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
  openWeatherApiKey: process.env.OPENWEATHER_API_KEY || '',
  mongoUri: process.env.MONGO_URI || '',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  forceDemoMode: process.env.FORCE_DEMO_MODE === 'true',
  isDemoMode: process.env.FORCE_DEMO_MODE === 'true' || !process.env.GOOGLE_API_KEY,
  SENTRY_DSN: process.env.SENTRY_DSN || '',
  SENTRY_ENVIRONMENT: process.env.SENTRY_ENVIRONMENT || 'development',
  SENTRY_TRACES_SAMPLE_RATE: parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE || '0.1'),
};

export const validateEnv = () => {
  if (!env.googleApiKey) {
    console.warn('⚠️  GOOGLE_API_KEY not set - running in DEMO mode with mock data');
  }
  if (!env.openWeatherApiKey) {
    console.warn('⚠️  OPENWEATHER_API_KEY not set - using mock weather data');
  }
  if (!env.mongoUri) {
    console.warn('⚠️  MONGO_URI not set - database features disabled');
  }
};
