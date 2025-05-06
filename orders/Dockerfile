FROM node:23-alpine AS base

RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare yarn@4.8.1 --activate
# Set working directory
WORKDIR /app
# *****************************************************************************
# STAGE 1: Build the project
# *****************************************************************************
FROM base AS builder

COPY . .
# Install only orders and its dependencies (like @twicetickets/common)
RUN yarn dlx turbo@2.5.0 prune --scope=orders --docker

# *****************************************************************************
# STAGE 2: Install dependencies & build the project
# *****************************************************************************
# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer

# First install the dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock
RUN yarn install --network-timeout 500000

# Build the project
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

RUN yarn turbo run build --filter=orders

# *****************************************************************************
# STAGE 3: Minimal runtime layer with only what's needed
# *****************************************************************************
FROM base AS runner

COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock

RUN yarn workspaces focus --production --all

# 2. Copy only dist output from orders
COPY --from=installer /app/orders/dist ./orders/dist
COPY --from=installer /app/packages/common/dist ./packages/common/dist

WORKDIR /app/orders
CMD ["node", "dist/index.js"]