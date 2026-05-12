FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy root config files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* turbo.json ./

# Copy packages
COPY packages ./packages

# Copy web
COPY apps/web ./apps/web

# Install dependencies
RUN pnpm install --no-frozen-lockfile

# Build
WORKDIR /app
RUN npx turbo run build --filter=web

FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app/apps/web/.next ./.next
COPY --from=builder /app/apps/web/public ./public
COPY --from=builder /app/apps/web/package.json ./package.json
COPY --from=builder /app/apps/web/node_modules ./node_modules

EXPOSE 3000

CMD ["npm", "run", "start"]
