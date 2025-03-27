FROM node:alpine

WORKDIR /app

# Install dependencies first for better caching
COPY package.json .
RUN npm install

# Copy the rest of the files
COPY . .

# Use the correct command based on environment
# OR for development:
CMD ["npm", "run", "dev"]