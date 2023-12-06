# Build stage
FROM arm64v8/node:alpine3.17 AS build

WORKDIR /app

COPY package.json package-lock.json .

RUN npm install
RUN apk add --no-cache curl

COPY . .

RUN npm run build

# Production stage
FROM arm64v8/node:alpine3.17 AS production

WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

CMD ["node", "./dist/index.js"]