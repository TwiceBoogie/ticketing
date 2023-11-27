FROM node:alpine

WORKDIR /app
COPY package.json .
RUN npm install --omit=dev
RUN apk add --no-cache curl
COPY . .

CMD ["npm", "start"]