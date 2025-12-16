# -----------------------------------------------------------------------------
# Stage 1: Builder
# Compiles TypeScript to JavaScript and generates the build artifacts.
# -----------------------------------------------------------------------------
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

# Copy dependency definitions
COPY package*.json ./

# Install all dependencies (including devDependencies for building)
# npm ci is faster and more reliable than npm install for CI/CD
RUN npm ci

# Copy source code and config files
COPY tsconfig.json ./
COPY src ./src

# Build the TypeScript application
RUN npm run build

# -----------------------------------------------------------------------------
# Stage 2: Runner
# Creates the final, lightweight production image.
# -----------------------------------------------------------------------------


FROM node:18-alpine AS runner

WORKDIR /usr/src/app

# Set NODE_ENV to production to optimize Express and other libraries
ENV NODE_ENV=production

# Copy package.json to install production dependencies
COPY package*.json ./

# Install ONLY production dependencies to keep image size small
# Clean cache to further reduce footprint
RUN npm ci --only=production && npm cache clean --force

# Copy the compiled JavaScript from the builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Create a non-root user for security
# The 'node' user is provided by the official Node.js image
USER node

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["node", "dist/server.js"]