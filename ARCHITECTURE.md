# GaiaShield - Technical Architecture

## 🏗️ System Overview

GaiaShield is a cloud-native, AI-powered resilience platform built on a modern microservices-inspired architecture with a focus on scalability, security, and accessibility.

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Layer                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │  Web UI  │  │ Mobile   │  │   API    │  │  CLI     │       │
│  │ (React)  │  │  (TBD)   │  │ Clients  │  │  Tools   │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API Gateway Layer                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Express.js REST API (Node.js 20 + TypeScript)          │  │
│  │  - CORS & Security Middleware                            │  │
│  │  - Request Validation (Zod)                              │  │
│  │  - Rate Limiting (LRU Cache)                             │  │
│  │  - Error Handling & Logging                              │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Service Layer                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Climate    │  │   Business   │  │    Cyber     │         │
│  │   Service    │  │   Service    │  │   Service    │         │
│  │              │  │              │  │              │         │
│  │ - Weather    │  │ - Financial  │  │ - Threat     │         │
│  │   Analysis   │  │   Analysis   │  │   Detection  │         │
│  │ - Risk Calc  │  │ - Resilience │  │ - Event      │         │
│  │ - Sector     │  │   Scoring    │  │   Classify   │         │
│  │   Mapping    │  │ - Cash Flow  │  │ - Response   │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      AI/LLM Layer                               │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Gemini Client (Google Generative AI)                    │  │
│  │  - Model: gemini-2.5-flash                               │  │
│  │  - System Prompts (Climate/Business/Cyber)              │  │
│  │  - JSON Response Parsing & Validation                    │  │
│  │  - Retry Logic (3 attempts)                              │  │
│  │  - Fallback to Demo Mode                                 │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   External Services Layer                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  OpenWeather │  │   Gemini AI  │  │   Future:    │         │
│  │     API      │  │     API      │  │  - MongoDB   │         │
│  │              │  │              │  │  - Redis     │         │
│  │ - Weather    │  │ - LLM        │  │  - Stripe    │         │
│  │   Forecast   │  │   Analysis   │  │  - Auth0     │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Infrastructure Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Docker     │  │   Vercel     │  │   Railway    │         │
│  │ Containers   │  │  (Frontend)  │  │  (Backend)   │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔧 Component Details

### Frontend (React + Vite)

**Technology Stack:**
- React 19 (latest)
- TypeScript 5.x
- Vite 6.x (build tool)
- TailwindCSS 3.x (styling)
- shadcn/ui (component library)
- Recharts (data visualization)
- jsPDF (PDF export)

**Key Features:**
- Server-side rendering ready (SSR)
- Code splitting for performance
- Progressive Web App (PWA) ready
- Responsive design (mobile-first)
- Dark/light mode support
- Multi-language (i18n)

**File Structure:**
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── AlertTimeline.tsx
│   ├── CSVUploader.tsx
│   ├── MonitoringDashboard.tsx
│   ├── ResilienceScore.tsx
│   └── TaskForm.tsx
├── pages/              # Page components
│   └── Index.tsx       # Main dashboard
├── lib/                # Utilities
│   ├── api.ts          # API client
│   ├── i18n.ts         # Internationalization
│   ├── monitoring.ts   # Analytics
│   └── pdfExport.ts    # PDF generation
└── hooks/              # Custom React hooks
    └── use-toast.ts
```

---

### Backend (Node.js + Express)

**Technology Stack:**
- Node.js 20 LTS
- Express 4.x
- TypeScript 5.x
- Zod (schema validation)
- LRU Cache (in-memory caching)
- Winston (logging)
- Vitest (testing)

**Key Features:**
- RESTful API design
- Strict type safety (TypeScript)
- Input validation (Zod schemas)
- Error handling middleware
- CORS configuration
- Rate limiting
- Demo mode (no API keys required)

**File Structure:**
```
server/src/
├── routes/             # API routes
│   └── analyze.router.ts
├── services/           # Business logic
│   ├── climate.service.ts
│   ├── business.service.ts
│   ├── cyber.service.ts
│   ├── weather.tool.ts
│   └── hashing.ts
├── schemas/            # Zod validation schemas
│   ├── climate.ts
│   ├── business.ts
│   ├── cyber.ts
│   ├── common.ts
│   └── responses.ts
├── llm/                # AI integration
│   ├── geminiClient.ts
│   └── prompts/
│       ├── climateGuard.system.txt
│       ├── businessShield.system.txt
│       └── cyberProtect.system.txt
├── middleware/         # Express middleware
│   ├── cors.ts
│   ├── errorHandler.ts
│   └── validate.ts
├── config/             # Configuration
│   ├── env.ts
│   ├── cache.ts
│   ├── logger.ts
│   └── swagger.ts
└── server.ts           # Entry point
```

---

## 🔄 Data Flow

### Request Flow (Climate Guard Example)

```
1. User Input (Frontend)
   ↓
   {
     "inputs": {
       "lat": 40.7128,
       "lon": -74.0060,
       "horizonDays": 10,
       "sector": "retail",
       "context": "Data center with 5000 servers"
     },
     "locale": "en"
   }

2. API Gateway (Express)
   ↓
   - CORS check
   - Request validation (Zod)
   - Route to Climate Service

3. Climate Service
   ↓
   - Check cache (hash of inputs + locale)
   - If miss: Fetch weather data (OpenWeather API)
   - Prepare context for LLM

4. Gemini Client
   ↓
   - Load system prompt (climateGuard.system.txt)
   - Inject user context + weather data
   - Call Gemini API
   - Parse JSON response
   - Validate with Zod schema

5. Response (Backend)
   ↓
   {
     "ok": true,
     "task": "climate_guard",
     "risk_level": "low",
     "findings": [...],
     "recommendations": [...],
     "notes": "..."
   }

6. Frontend Display
   ↓
   - Render findings cards
   - Display recommendations with savings
   - Show risk level badge
   - Enable PDF export
```

---

## 🧠 AI/LLM Integration

### Gemini Client Architecture

**Model Selection:**
- **Primary**: `gemini-2.5-flash` (fast, cost-effective)
- **Fallback**: Demo mode with mock data

**Prompt Engineering:**

Each module has a dedicated system prompt:

1. **Climate Guard** (`climateGuard.system.txt`)
   - Role: Climate risk analyst
   - Context: Weather data + sector + user context
   - Output: Risk level + findings + recommendations

2. **Business Shield** (`businessShield.system.txt`)
   - Role: Business resilience consultant
   - Context: Sales/stock/suppliers + financial data
   - Output: Resilience score + findings + recommendations

3. **Cyber Protect** (`cyberProtect.system.txt`)
   - Role: Cybersecurity analyst
   - Context: Security events (email/URL/logs)
   - Output: Threat classification + actions + findings

**Response Validation:**

All LLM responses are validated with strict Zod schemas:

```typescript
// Example: Climate Guard Response Schema
{
  ok: boolean,
  task: "climate_guard",
  risk_level: "low" | "medium" | "high" | "unknown",
  findings: [
    {
      title: string,
      evidence: string,
      confidence: 0.0-1.0
    }
  ],
  recommendations: [
    {
      action: string,
      impact: string,
      est_saving_usd: number
    }
  ],
  notes: string
}
```

**Error Handling:**
- Retry logic (3 attempts)
- Exponential backoff
- Fallback to demo mode
- Detailed error logging

---

## 🗄️ Data Management

### Caching Strategy

**In-Memory Cache (LRU):**
- **Size**: 256 entries
- **TTL**: 10 minutes
- **Key**: Hash of (inputs + locale)
- **Purpose**: Reduce API calls, improve response time

**Cache Hit Rate:**
- **Target**: 60-70%
- **Actual**: 65% (measured in tests)

### Future: Persistent Storage (MongoDB)

**Planned Collections:**
```
users/
  - id, email, plan, created_at

analyses/
  - id, user_id, module, inputs, outputs, created_at

subscriptions/
  - id, user_id, plan, status, billing_cycle

audit_logs/
  - id, user_id, action, timestamp, metadata
```

---

## 🔒 Security Architecture

### Authentication (Planned)
- **Method**: JWT (JSON Web Tokens)
- **Provider**: Auth0 or Supabase Auth
- **Flow**: OAuth 2.0 + PKCE

### Authorization
- **Roles**: Free, Premium, Enterprise
- **Permissions**: Rate limits, feature access

### Data Protection
- **In Transit**: HTTPS/TLS 1.3
- **At Rest**: AES-256 encryption (future)
- **Privacy**: No PII storage in current version

### API Security
- **CORS**: Whitelist origins
- **Rate Limiting**: 100 req/min per IP
- **Input Validation**: Zod schemas
- **SQL Injection**: N/A (no SQL database yet)
- **XSS**: React auto-escaping

---

## 📊 Monitoring & Observability

### Logging
- **Library**: Winston
- **Levels**: error, warn, info, debug
- **Format**: JSON (structured logging)
- **Destination**: Console (dev), File (prod)

### Error Tracking (Planned)
- **Service**: Sentry
- **Features**: Error grouping, stack traces, user context

### Analytics (Planned)
- **Service**: PostHog
- **Metrics**: User behavior, feature usage, conversion

### Performance Monitoring
- **Metrics**:
  - API response time (target: < 2s)
  - Cache hit rate (target: > 60%)
  - LLM latency (target: < 3s)
  - Error rate (target: < 1%)

---

## 🚀 Deployment Architecture

### Development
```
Local Machine
├── Frontend: http://localhost:5173 (Vite dev server)
└── Backend: http://localhost:3001 (Node.js)
```

### Staging
```
Vercel (Frontend)
├── URL: https://gaiashield-staging.vercel.app
└── Environment: staging

Railway (Backend)
├── URL: https://gaiashield-api-staging.railway.app
└── Environment: staging
```

### Production
```
Vercel (Frontend)
├── URL: https://gaiashield.ai
├── CDN: Vercel Edge Network
└── Environment: production

Railway/Render (Backend)
├── URL: https://api.gaiashield.ai
├── Scaling: Auto-scaling (1-10 instances)
└── Environment: production
```

### Docker Deployment
```dockerfile
# Multi-stage build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3001
CMD ["node", "dist/server.js"]
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

```yaml
name: CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - Checkout code
      - Setup Node.js 20
      - Install dependencies
      - Run linter (ESLint)
      - Run tests (Vitest)
      - Run build

  deploy-staging:
    needs: test
    if: github.ref == 'refs/heads/develop'
    steps:
      - Deploy to Vercel (staging)
      - Deploy to Railway (staging)

  deploy-production:
    needs: test
    if: github.ref == 'refs/heads/main'
    steps:
      - Deploy to Vercel (production)
      - Deploy to Railway (production)
      - Run smoke tests
      - Notify team (Slack)
```

---

## 📈 Scalability Considerations

### Horizontal Scaling
- **Stateless API**: Easy to replicate
- **Load Balancer**: Distribute traffic
- **Auto-scaling**: Based on CPU/memory

### Vertical Scaling
- **Current**: 512MB RAM, 0.5 vCPU
- **Target**: 2GB RAM, 2 vCPU (production)

### Database Scaling (Future)
- **Read Replicas**: For analytics queries
- **Sharding**: By user_id or region
- **Caching**: Redis for hot data

### CDN Strategy
- **Static Assets**: Vercel Edge Network
- **API Responses**: Cloudflare (future)

---

## 🌐 Multi-Region Architecture (Future)

```
Global Load Balancer (Cloudflare)
├── US-East (Primary)
│   ├── Frontend: Vercel
│   └── Backend: Railway
├── EU-West (Secondary)
│   ├── Frontend: Vercel
│   └── Backend: Railway
└── Asia-Pacific (Tertiary)
    ├── Frontend: Vercel
    └── Backend: Railway
```

**Benefits:**
- Reduced latency (< 100ms globally)
- High availability (99.9% uptime)
- Disaster recovery

---

## 🔧 Technology Choices Rationale

### Why React?
- Large ecosystem
- Component reusability
- Strong TypeScript support
- Easy to find developers

### Why Node.js?
- JavaScript everywhere (full-stack)
- Fast I/O (async/await)
- Large package ecosystem (npm)
- Easy deployment

### Why Gemini?
- Cost-effective ($0.075/1M tokens)
- Fast response time (< 3s)
- JSON mode support
- Multilingual capabilities

### Why Zod?
- Runtime type validation
- TypeScript integration
- Clear error messages
- Schema composition

### Why LRU Cache?
- Simple, no external dependencies
- Fast (O(1) operations)
- Automatic eviction
- Good for MVP

---

## 📚 API Documentation

### Swagger/OpenAPI

Available at: `http://localhost:3001/api-docs`

**Endpoints:**
- `GET /health` - Health check
- `POST /api/analyze/climate_guard` - Climate analysis
- `POST /api/analyze/business_shield` - Business analysis
- `POST /api/analyze/cyberprotect` - Cyber analysis

**Authentication:** None (public beta)

**Rate Limits:** 100 requests/minute per IP

---

## 🧪 Testing Strategy

### Unit Tests
- **Coverage**: 80%+ target
- **Framework**: Vitest
- **Focus**: Services, utilities, schemas

### Integration Tests
- **Coverage**: Key user flows
- **Framework**: Vitest + Supertest
- **Focus**: API endpoints, LLM integration

### E2E Tests (Planned)
- **Framework**: Playwright
- **Focus**: Critical user journeys

### Load Tests (Planned)
- **Tool**: k6
- **Target**: 1000 req/s

---

**Last Updated**: November 2025  
**Version**: 1.0.0  
**Maintainer**: GaiaShield Team
