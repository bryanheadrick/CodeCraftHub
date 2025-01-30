# Dockerfile
# Multi-stage build for optimized production image

# Build Stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Production Stage
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy built assets from builder
COPY --from=builder /usr/src/app .

# Set NODE_ENV
ENV NODE_ENV=production

# Expose application port
EXPOSE 3000

# Start command
CMD ["npm", "start"]