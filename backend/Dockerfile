# Multi-stage build for Node.js backend
FROM node:20-alpine AS base

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Development stage
FROM base AS development
# Install all dependencies (including devDependencies)
RUN npm ci
# Copy source code
COPY . .
# Expose port
EXPOSE 5000
# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]
# Start development server with nodemon
CMD ["npm", "run", "dev"]

# Production dependencies stage
FROM base AS dependencies
# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Production stage
FROM base AS production
# Copy production dependencies
COPY --from=dependencies /app/node_modules ./node_modules
# Copy source code
COPY . .
# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S backend -u 1001
# Change ownership of app directory
RUN chown -R backend:nodejs /app
USER backend
# Expose port
EXPOSE 5000
# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js
# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]
# Start production server
CMD ["npm", "start"]
