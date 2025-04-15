# ====== Builder Stage ======
FROM node:alpine AS builder

WORKDIR /app

# Copy only dependency files first for caching
COPY package*.json ./

# Install all dependencies including dev ones
RUN npm install

# Copy the entire source code
COPY . .

# Build the TypeScript code
RUN npm run build

# ====== Runner Stage ======
FROM node:alpine

WORKDIR /app

# Only copy over package.json and lock for prod install
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy compiled JS output only
COPY --from=builder /app/dist ./dist

# Set environment variables (override in K8s)
ENV NODE_ENV=production

# Start the service
CMD ["node", "dist/index.js"]
