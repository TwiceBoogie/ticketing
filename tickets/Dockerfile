# Build stage
FROM arm64v8/node:alpine3.17

WORKDIR /app

COPY package.json package-lock.json .

RUN npm install --omit=dev --frozen-lockfile

COPY /dist ./dist

CMD ["node", "./dist/index.js"]

