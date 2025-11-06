import { env } from '../config/env.js';
import { logger } from '../config/logger.js';

export interface WeatherForecast {
  lat: number;
  lon: number;
  horizonDays: number;
  summary: string;
  maxTemp: number;
  minTemp: number;
  totalPrecipitation: number;
  heatwaveDays: number;
  extremeWeatherAlerts: string[];
}

const MOCK_FORECASTS: Record<string, WeatherForecast> = {
  'dakar': {
    lat: 14.7167,
    lon: -17.4677,
    horizonDays: 10,
    summary: 'Conditions chaudes et sèches avec températures élevées. Risque de vague de chaleur J+3 à J+6.',
    maxTemp: 38,
    minTemp: 24,
    totalPrecipitation: 2,
    heatwaveDays: 4,
    extremeWeatherAlerts: ['Vague de chaleur J+3 à J+6', 'Vent de sable possible J+8'],
  },
  'default': {
    lat: 0,
    lon: 0,
    horizonDays: 10,
    summary: 'Conditions météo stables avec températures modérées.',
    maxTemp: 28,
    minTemp: 18,
    totalPrecipitation: 15,
    heatwaveDays: 0,
    extremeWeatherAlerts: [],
  },
};

const getMockForecast = (lat: number, lon: number, horizonDays: number): WeatherForecast => {
  // Detect Dakar region
  if (Math.abs(lat - 14.7167) < 1 && Math.abs(lon - (-17.4677)) < 1) {
    return { ...MOCK_FORECASTS.dakar, lat, lon, horizonDays };
  }
  return { ...MOCK_FORECASTS.default, lat, lon, horizonDays };
};

interface OpenWeatherDailyForecast {
  temp: {
    max: number;
    min: number;
  };
  rain?: number;
}

interface OpenWeatherAlert {
  event: string;
}

interface OpenWeatherResponse {
  daily: OpenWeatherDailyForecast[];
  alerts?: OpenWeatherAlert[];
}

export const getForecast = async (
  lat: number,
  lon: number,
  horizonDays: number
): Promise<WeatherForecast> => {
  if (!env.openWeatherApiKey) {
    logger.info('Using mock weather data (OPENWEATHER_API_KEY not set)');
    return getMockForecast(lat, lon, horizonDays);
  }

  try {
    // OpenWeather OneCall API 3.0
    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&units=metric&appid=${env.openWeatherApiKey}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`OpenWeather API error: ${response.status}`);
    }

    const data = (await response.json()) as OpenWeatherResponse;
    
    // Process forecast data
    const dailyForecasts = data.daily.slice(0, horizonDays);
    const temps = dailyForecasts.map((d) => d.temp);
    const maxTemp = Math.max(...temps.map((t) => t.max));
    const minTemp = Math.min(...temps.map((t) => t.min));
    const totalPrecipitation = dailyForecasts.reduce((sum, d) => sum + (d.rain ?? 0), 0);
    const heatwaveDays = temps.filter((t) => t.max > 35).length;
    
    const alerts = data.alerts?.map((alert) => alert.event) ?? [];
    
    const summary = `Prévisions ${horizonDays} jours: ${maxTemp}°C max, ${minTemp}°C min, ${totalPrecipitation}mm précipitations.`;

    return {
      lat,
      lon,
      horizonDays,
      summary,
      maxTemp,
      minTemp,
      totalPrecipitation,
      heatwaveDays,
      extremeWeatherAlerts: alerts,
    };
  } catch (error) {
    logger.warn('OpenWeather API call failed, using mock data', { error });
    return getMockForecast(lat, lon, horizonDays);
  }
};
