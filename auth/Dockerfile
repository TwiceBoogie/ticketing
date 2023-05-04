FROM node:alpine

WORKDIR /app
COPY package.json .
RUN npm install --only=prod
RUN apk add --no-cache curl
COPY . .

CMD ["npm", "start"]