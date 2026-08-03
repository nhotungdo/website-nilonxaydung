# =========================================================
# Dockerfile for Nilon Invoices Backend & API Service
# =========================================================

FROM node:20-alpine AS builder
RUN apk add --no-cache python3 make g++ libc6-compat
WORKDIR /app

COPY package.json pnpm-lock.yaml* package-lock.json* ./
RUN npm install

COPY . .
RUN npm run compile

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src ./src
COPY --from=builder /app/.env ./.env

EXPOSE 3001
ENV PORT 3001

CMD ["node", "dist/main/main.js"]
