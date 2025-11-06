# Multi-stage build for GaiaShield backend

# Stage 1: Builder
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY server/package.json server/pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY server/ .

# Build TypeScript
RUN pnpm build

# Stage 2: Runner
FROM node:20-alpine AS runner

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY server/package.json server/pnpm-lock.yaml* ./

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile

# Copy built files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/llm/prompts ./dist/llm/prompts

# Set environment
ENV NODE_ENV=production
ENV PORT=3001

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start server
CMD ["node", "dist/server.js"]
