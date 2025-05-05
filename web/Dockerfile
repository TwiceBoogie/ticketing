FROM node:23-alpine AS base

RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare yarn@4.8.1 --activate
WORKDIR /app

# *****************************************************************************
# STAGE 1: Turbo prune for Next.js web
# *****************************************************************************
FROM base AS builder
COPY . .
RUN npx turbo prune --scope=web --docker

# *****************************************************************************
# STAGE 2: Install dependencies & build the project
# *****************************************************************************
FROM base AS installer

WORKDIR /app

COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock
RUN yarn install --network-timeout 500000

COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

# Optional set Next.js environment variables here or in Docker compose

RUN yarn build --filter=web

# *****************************************************************************
# STAGE 3: Runtime
# *****************************************************************************
FROM base AS runner

WORKDIR /app

COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock

RUN yarn workspaces focus --production --all

COPY --from=installer /app/web/public ./web/public
COPY --from=installer /app/web/.next ./web/.next

ENV NODE_ENV=production
EXPOSE 3000

WORKDIR /app/web
CMD ["yarn", "start"]