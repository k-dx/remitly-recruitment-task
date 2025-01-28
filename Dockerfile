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

# Stage 2: Production
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy only the necessary runtime dependencies
COPY package*.json ./
RUN npm install --production

# Copy the compiled JavaScript code from the build stage
COPY --from=build /app/dist ./dist

# Expose the port for the API
EXPOSE 8080

ENV NODE_PATH=./dist

# Start the application
CMD ["npm", "run", "start"]