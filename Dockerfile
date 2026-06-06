# 1. Install dependencies only when needed
FROM node:20-alpine AS deps
# Add libc6-compat for native compile compatibilities
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package descriptors and lockfile
COPY package.json package-lock.json ./
RUN npm ci

# 2. Build the source code
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate the Prisma client to ensure model types and engine binaries exist
RUN npx prisma generate

ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# 3. Create the production runtime image
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy asset public folder
COPY --from=builder /app/public ./public

# Setup the Next.js cache directory with correct permissions
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Leverages output tracing to create a minimal container size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy the seeded SQLite database and prisma directory containing schemas/engines
COPY --from=builder --chown=nextjs:nodejs /app/dev.db ./dev.db
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# server.js is created by Next.js in standalone output mode
CMD ["node", "server.js"]
