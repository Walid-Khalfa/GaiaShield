import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'GaiaShield API',
      version: '1.0.0',
      description: `
**GaiaShield** - AI-Powered Risk Protection Platform

Protège les entrepreneurs et PME contre les risques **climatiques**, **économiques** et **numériques** grâce à l'IA.

Propulsé par **Gemini 2.5 Flash** et **OpenWeather API**.

---

**Projet GEF2025 Hackathon** - The AI-Powered Entrepreneur: Protecting the Future
      `.trim(),
      contact: {
        name: 'GaiaShield Team',
        url: 'https://github.com/gaiashield',
      },
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server',
      },
      {
        url: 'https://api.gaiashield.com',
        description: 'Production server',
      },
    ],
    tags: [
      {
        name: 'Analysis',
        description: 'AI-powered risk analysis endpoints',
      },
      {
        name: 'Health',
        description: 'System health and status',
      },
    ],
    components: {
      schemas: {
        ClimateInputs: {
          type: 'object',
          required: ['lat', 'lon', 'horizonDays', 'sector'],
          properties: {
            lat: {
              type: 'number',
              minimum: -90,
              maximum: 90,
              description: 'Latitude',
              example: 14.7167,
            },
            lon: {
              type: 'number',
              minimum: -180,
              maximum: 180,
              description: 'Longitude',
              example: -17.4677,
            },
            horizonDays: {
              type: 'integer',
              minimum: 1,
              maximum: 30,
              description: 'Forecast horizon in days',
              example: 10,
            },
            sector: {
              type: 'string',
              enum: ['agri', 'retail', 'logistics', 'tourism', 'construction', 'other'],
              description: 'Business sector',
              example: 'agri',
            },
          },
        },
        BusinessInputs: {
          type: 'object',
          required: ['salesCsv', 'stockCsv', 'suppliersCsv'],
          properties: {
            salesCsv: {
              type: 'string',
              description: 'CSV data of sales records',
              example: 'date,product,amount\n2024-01-01,Product A,1000',
            },
            stockCsv: {
              type: 'string',
              description: 'CSV data of stock levels',
              example: 'product,quantity,threshold\nProduct A,50,20',
            },
            suppliersCsv: {
              type: 'string',
              description: 'CSV data of suppliers',
              example: 'name,country,reliability\nSupplier A,Tunisia,0.9',
            },
          },
        },
        CyberInputs: {
          type: 'object',
          required: ['emails', 'urls', 'logs'],
          properties: {
            emails: {
              type: 'array',
              items: { type: 'string' },
              description: 'List of email addresses to analyze',
              example: ['support@paypal.com', 'admin@suspicious-site.xyz'],
            },
            urls: {
              type: 'array',
              items: { type: 'string' },
              description: 'List of URLs to analyze',
              example: ['https://paypal.com', 'http://paypa1.com'],
            },
            logs: {
              type: 'array',
              items: { type: 'string' },
              description: 'System logs to analyze',
              example: ['Failed login attempt from 192.168.1.100'],
            },
          },
        },
        AnalyzeRequest: {
          type: 'object',
          required: ['inputs'],
          properties: {
            inputs: {
              oneOf: [
                { $ref: '#/components/schemas/ClimateInputs' },
                { $ref: '#/components/schemas/BusinessInputs' },
                { $ref: '#/components/schemas/CyberInputs' },
              ],
            },
            locale: {
              type: 'string',
              default: 'fr-TN',
              description: 'Response language locale',
              example: 'fr-TN',
            },
            constraints: {
              type: 'object',
              properties: {
                max_recos: {
                  type: 'integer',
                  default: 5,
                  description: 'Maximum number of recommendations',
                  example: 5,
                },
                tone: {
                  type: 'string',
                  enum: ['concise', 'detailed', 'technical'],
                  default: 'concise',
                  description: 'Response tone',
                  example: 'concise',
                },
                cost_mode: {
                  type: 'string',
                  enum: ['cheap_fast', 'balanced', 'premium'],
                  default: 'cheap_fast',
                  description: 'Cost optimization mode',
                  example: 'cheap_fast',
                },
              },
            },
          },
        },
        Finding: {
          type: 'object',
          required: ['title', 'evidence', 'confidence'],
          properties: {
            title: {
              type: 'string',
              description: 'Finding title',
              example: 'Vague de chaleur imminente',
            },
            evidence: {
              type: 'string',
              description: 'Supporting evidence',
              example: 'Températures prévues > 40°C pendant 5 jours',
            },
            confidence: {
              type: 'number',
              minimum: 0,
              maximum: 1,
              description: 'Confidence score',
              example: 0.85,
            },
          },
        },
        Recommendation: {
          type: 'object',
          required: ['action', 'impact'],
          properties: {
            action: {
              type: 'string',
              description: 'Recommended action',
              example: 'Installer un système d\'irrigation goutte-à-goutte',
            },
            impact: {
              type: 'string',
              enum: ['low', 'medium', 'high'],
              description: 'Expected impact level',
              example: 'high',
            },
            est_saving_usd: {
              type: 'number',
              description: 'Estimated savings in USD',
              example: 500,
            },
          },
        },
        AnalyzeResponse: {
          type: 'object',
          required: ['ok', 'task', 'risk_level', 'findings', 'recommendations'],
          properties: {
            ok: {
              type: 'boolean',
              description: 'Success status',
              example: true,
            },
            task: {
              type: 'string',
              enum: ['climate_guard', 'business_shield', 'cyberprotect'],
              description: 'Task type',
              example: 'climate_guard',
            },
            risk_level: {
              type: 'string',
              enum: ['low', 'medium', 'high', 'critical'],
              description: 'Overall risk level',
              example: 'medium',
            },
            findings: {
              type: 'array',
              items: { $ref: '#/components/schemas/Finding' },
              description: 'Analysis findings',
            },
            recommendations: {
              type: 'array',
              items: { $ref: '#/components/schemas/Recommendation' },
              description: 'Recommended actions',
            },
            notes: {
              type: 'string',
              description: 'Additional notes',
              example: 'Sources: OpenWeather API',
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          required: ['ok', 'error'],
          properties: {
            ok: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'string',
              description: 'Error message',
              example: 'Validation error',
            },
            code: {
              type: 'string',
              description: 'Error code',
              example: 'VALIDATION_ERROR',
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts', './src/server.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
