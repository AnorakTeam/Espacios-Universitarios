# ── Stage 1: install dependencies ───────────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ── Stage 2: build ───────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* vars are embedded at build time by Next.js
ARG NEXT_PUBLIC_USERS_API_URL=http://localhost:8080
ARG NEXT_PUBLIC_SPACES_API_URL=http://localhost:8082
ARG NEXT_PUBLIC_RESERVATIONS_API_URL=http://localhost:8081
ENV NEXT_PUBLIC_USERS_API_URL=$NEXT_PUBLIC_USERS_API_URL
ENV NEXT_PUBLIC_SPACES_API_URL=$NEXT_PUBLIC_SPACES_API_URL
ENV NEXT_PUBLIC_RESERVATIONS_API_URL=$NEXT_PUBLIC_RESERVATIONS_API_URL

RUN npm run build

# ── Stage 3: production runner ───────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# standalone output bundles only what's needed
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["node", "server.js"]
