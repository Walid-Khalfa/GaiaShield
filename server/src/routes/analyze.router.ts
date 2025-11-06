import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { climateRequestSchema } from '../schemas/climate.js';
import { businessRequestSchema } from '../schemas/business.js';
import { cyberRequestSchema } from '../schemas/cyber.js';
import { analyzeClimate } from '../services/climate.service.js';
import { analyzeBusiness } from '../services/business.service.js';
import { analyzeCyber } from '../services/cyber.service.js';

export const analyzeRouter: Router = Router();

/**
 * @openapi
 * /api/analyze/climate_guard:
 *   post:
 *     tags:
 *       - Analysis
 *     summary: Climate risk analysis
 *     description: Analyzes climate risks using OpenWeather API and Gemini AI
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AnalyzeRequest'
 *           example:
 *             inputs:
 *               lat: 14.7167
 *               lon: -17.4677
 *               horizonDays: 10
 *               sector: agri
 *             locale: fr-TN
 *             constraints:
 *               max_recos: 5
 *               tone: concise
 *               cost_mode: cheap_fast
 *     responses:
 *       200:
 *         description: Successful analysis
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AnalyzeResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
analyzeRouter.post('/climate_guard', validate(climateRequestSchema), async (req, res, next) => {
  try {
    const result = await analyzeClimate(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * @openapi
 * /api/analyze/business_shield:
 *   post:
 *     tags:
 *       - Analysis
 *     summary: Business resilience analysis
 *     description: Analyzes business data (sales, stock, suppliers) for economic resilience
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AnalyzeRequest'
 *           example:
 *             inputs:
 *               salesCsv: "date,product,amount\n2024-01-01,Product A,1000"
 *               stockCsv: "product,quantity,threshold\nProduct A,50,20"
 *               suppliersCsv: "name,country,reliability\nSupplier A,Tunisia,0.9"
 *             locale: fr-TN
 *             constraints:
 *               max_recos: 5
 *               tone: concise
 *     responses:
 *       200:
 *         description: Successful analysis
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AnalyzeResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
analyzeRouter.post('/business_shield', validate(businessRequestSchema), async (req, res, next) => {
  try {
    const result = await analyzeBusiness(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * @openapi
 * /api/analyze/cyberprotect:
 *   post:
 *     tags:
 *       - Analysis
 *     summary: Cybersecurity threat analysis
 *     description: Analyzes emails, URLs, and logs for phishing and security threats
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AnalyzeRequest'
 *           example:
 *             inputs:
 *               emails: ["support@paypal.com", "admin@suspicious-site.xyz"]
 *               urls: ["https://paypal.com", "http://paypa1.com"]
 *               logs: ["Failed login attempt from 192.168.1.100"]
 *             locale: fr-TN
 *             constraints:
 *               max_recos: 5
 *               tone: concise
 *     responses:
 *       200:
 *         description: Successful analysis
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AnalyzeResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
analyzeRouter.post('/cyberprotect', validate(cyberRequestSchema), async (req, res, next) => {
  try {
    const result = await analyzeCyber(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
});
