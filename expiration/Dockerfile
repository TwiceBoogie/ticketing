# ====== Builder Stage ======
FROM node:20-alpine AS builder

WORKDIR /app

# Copy common package first and build
COPY common ../common
RUN cd ../common && npm install && npm run build

# Install common package into expiration
COPY expiration/package*.json ./
RUN npm install ../common

# Copy expiration source code and build
COPY expiration/. .
RUN npm run build

# ====== Runner Stage ======
FROM node:20-alpine

WORKDIR /app

# Copy runtime dependency definitions
COPY --from=builder /app/package.json .
COPY --from=builder /app/package-lock.json .

# Install runtime dependencies only
RUN npm install --omit=dev

# NOW copy built expiration files
COPY --from=builder /app/dist ./dist

# Copy the local dependency AFTER npm install to avoid overwrite
COPY --from=builder /app/node_modules/@twicetickets/common ./node_modules/@twicetickets/common

EXPOSE 3000
CMD ["node", "dist/index.js"]
