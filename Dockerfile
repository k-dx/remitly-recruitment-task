# Use Node.js base image
FROM node:22-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and config files
COPY src ./src/
COPY init-db ./init-db/
COPY .mocharc.json ./
COPY .env.prod ./
COPY tsconfig.json ./

# Expose the port for the API
EXPOSE 3000

CMD ["npm", "run", "dev"]