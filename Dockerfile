# Development Dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Install nodemon globally
RUN npm install -g nodemon

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start command using nodemon
CMD ["nodemon", "src/app.js"]