# Multi-stage build for React frontend
FROM node:20-alpine AS base

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Development stage
FROM base AS development
# Install all dependencies with legacy peer deps to handle React 19 compatibility
RUN npm install --legacy-peer-deps
# Copy source code
COPY . .
# Expose Vite dev server port
EXPOSE 5173
# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]
# Start development server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# Build stage
FROM base AS build
# Install dependencies with legacy peer deps
RUN npm install --legacy-peer-deps
# Copy source code
COPY . .
# Build the application
RUN npm run build

# Production stage with Nginx
FROM nginx:alpine AS production
# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html
# Create non-root user (nginx group already exists)
RUN adduser -S frontend -u 1001 -G nginx
# Change ownership of nginx directories
RUN chown -R frontend:nginx /var/cache/nginx && \
    chown -R frontend:nginx /var/log/nginx && \
    chown -R frontend:nginx /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R frontend:nginx /var/run/nginx.pid
# Switch to non-root user
USER frontend
# Expose port
EXPOSE 80
# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1
# Start nginx
CMD ["nginx", "-g", "daemon off;"]
