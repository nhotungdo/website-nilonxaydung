FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy root config files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* turbo.json ./

# Copy packages
COPY packages ./packages

# Copy api
COPY apps/api ./apps/api

# Install dependencies
RUN pnpm install --no-frozen-lockfile

# Generate Prisma Client
WORKDIR /app/apps/api
RUN npx prisma generate

# Build
WORKDIR /app
RUN npx turbo run build --filter=api

FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json ./package.json
COPY --from=builder /app/apps/api/node_modules ./node_modules
COPY --from=builder /app/apps/api/prisma ./prisma

EXPOSE 3001

CMD ["npm", "run", "start:prod"]
