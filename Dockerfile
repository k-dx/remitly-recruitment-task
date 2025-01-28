# Stage 1: Build/dev
# Use Node.js base image
FROM node:22-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build TypeScript code
RUN npm run build

# Expose API port
EXPOSE 3000

ENV NODE_PATH=./dist

# Command to start the app
CMD ["npm", "run", "start"]