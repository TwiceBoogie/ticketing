# Stage 1: Build stage
FROM arm64v8/node:alpine3.17 AS build

WORKDIR /app

# Copy package.json and install all dependencies
COPY package.json package-lock.json .
RUN npm install --frozen-lockfile

# Copy the entire application
COPY . .

ARG NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

# Build the Next.js application
RUN npm run build

# Stage 2: Production stage
FROM arm64v8/node:alpine3.17 AS production

WORKDIR /app

# Copy only necessary artifacts from the build stage
COPY --from=build /app/package.json .
COPY --from=build /app/package-lock.json .
COPY --from=build /app/next.config.js ./
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static

# Install only production dependencies
# RUN npm install --omit=dev

# Define the command to start the application
CMD ["node", "server.js"]