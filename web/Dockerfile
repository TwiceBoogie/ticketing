FROM node:alpine

WORKDIR /app
COPY package.json .
RUN npm install
RUN apk add --no-cache curl

COPY . .

CMD ["npm", "run", "dev"]