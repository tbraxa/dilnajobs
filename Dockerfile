# syntax=docker/dockerfile:1
# Portable image for Cloud Run (and any container host).
# Build: docker build -t dilnajobs .
# Cloud Run: set PORT=8080, DATABASE_URL, SESSION_SECRET, APP_URL, ADMIN_EMAILS, …

FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_OUTPUT=standalone
ENV SESSION_SECRET=build-placeholder-not-for-production-use-32chars
ENV DATABASE_URL=postgres://dilna_app:dilna@127.0.0.1:5432/dilnajobs
ENV APP_URL=http://localhost:8080
ENV SKIP_DB_MIGRATE=1
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=8080
ENV HOSTNAME=0.0.0.0
RUN addgroup -S dilna && adduser -S dilna -G dilna
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
USER dilna
EXPOSE 8080
CMD ["node", "server.js"]
