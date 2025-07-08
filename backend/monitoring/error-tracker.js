class ErrorTracker {
  constructor() {
    this.errors = [];
    this.maxErrors = 100; // Keep last 100 errors
    this.startTime = new Date();
  }

  // Log error with context
  logError(error, context = {}) {
    const errorEntry = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      message: error.message || error,
      stack: error.stack,
      context: {
        ...context,
        userAgent: context.req?.headers['user-agent'],
        ip: context.req?.ip,
        url: context.req?.url,
        method: context.req?.method,
        params: context.req?.params,
        query: context.req?.query
      },
      severity: this.determineSeverity(error)
    };

    this.errors.push(errorEntry);
    
    // Keep only the last N errors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors);
    }

    // Log to console for immediate visibility
    console.error(`[ERROR-${errorEntry.id}] ${errorEntry.message}`, {
      context: errorEntry.context,
      stack: errorEntry.stack
    });

    // In production, you might want to send to external service
    this.sendToExternalService(errorEntry);

    return errorEntry.id;
  }

  // Determine error severity
  determineSeverity(error) {
    if (error.status >= 500) return 'high';
    if (error.status >= 400) return 'medium';
    if (error.name === 'ValidationError') return 'low';
    if (error.name === 'CastError') return 'low';
    return 'medium';
  }

  // Generate unique error ID
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Get error statistics
  getStats() {
    const now = new Date();
    const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const recentErrors = this.errors.filter(e => new Date(e.timestamp) > hourAgo);
    const todayErrors = this.errors.filter(e => new Date(e.timestamp) > dayAgo);

    return {
      total: this.errors.length,
      lastHour: recentErrors.length,
      last24Hours: todayErrors.length,
      bySevirty: {
        high: this.errors.filter(e => e.severity === 'high').length,
        medium: this.errors.filter(e => e.severity === 'medium').length,
        low: this.errors.filter(e => e.severity === 'low').length
      },
      uptime: Math.floor((now - this.startTime) / 1000)
    };
  }

  // Get recent errors
  getRecentErrors(limit = 10) {
    return this.errors
      .slice(-limit)
      .reverse()
      .map(error => ({
        id: error.id,
        timestamp: error.timestamp,
        message: error.message,
        severity: error.severity,
        context: {
          url: error.context.url,
          method: error.context.method,
          ip: error.context.ip
        }
      }));
  }

  // Send error to external monitoring service
  sendToExternalService(errorEntry) {
    // In production, integrate with services like:
    // - Sentry
    // - LogRocket
    // - DataDog
    // - New Relic
    // - Rollbar
    
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to webhook or external API
      // This is where you'd integrate with your monitoring service
      console.log('📡 Sending error to external monitoring service:', errorEntry.id);
    }
  }

  // Clear old errors
  clearErrors() {
    this.errors = [];
    console.log('🗑️ Error history cleared');
  }
}

// Performance monitoring
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      requests: [],
      maxMetrics: 1000
    };
  }

  // Track request performance
  trackRequest(req, res, startTime) {
    const duration = Date.now() - startTime;
    const metric = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: duration,
      userAgent: req.headers['user-agent'],
      ip: req.ip
    };

    this.metrics.requests.push(metric);
    
    // Keep only recent metrics
    if (this.metrics.requests.length > this.metrics.maxMetrics) {
      this.metrics.requests = this.metrics.requests.slice(-this.metrics.maxMetrics);
    }

    // Log slow requests
    if (duration > 1000) { // > 1 second
      console.warn(`🐌 Slow request: ${req.method} ${req.url} - ${duration}ms`);
    }
  }

  // Get performance stats
  getStats() {
    const requests = this.metrics.requests;
    if (requests.length === 0) return { noData: true };

    const durations = requests.map(r => r.duration);
    const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
    const slowRequests = requests.filter(r => r.duration > 1000);

    return {
      totalRequests: requests.length,
      averageResponseTime: Math.round(avgDuration),
      slowRequests: slowRequests.length,
      statusCodes: {
        '2xx': requests.filter(r => r.status >= 200 && r.status < 300).length,
        '3xx': requests.filter(r => r.status >= 300 && r.status < 400).length,
        '4xx': requests.filter(r => r.status >= 400 && r.status < 500).length,
        '5xx': requests.filter(r => r.status >= 500).length
      },
      topEndpoints: this.getTopEndpoints(requests)
    };
  }

  getTopEndpoints(requests) {
    const endpoints = {};
    requests.forEach(req => {
      const key = `${req.method} ${req.url}`;
      if (!endpoints[key]) {
        endpoints[key] = { count: 0, totalDuration: 0 };
      }
      endpoints[key].count++;
      endpoints[key].totalDuration += req.duration;
    });

    return Object.entries(endpoints)
      .map(([endpoint, stats]) => ({
        endpoint,
        count: stats.count,
        avgDuration: Math.round(stats.totalDuration / stats.count)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }
}

// Create singleton instances
const errorTracker = new ErrorTracker();
const performanceMonitor = new PerformanceMonitor();

// Middleware for error tracking
const errorTrackingMiddleware = (req, res, next) => {
  const startTime = Date.now();
  
  // Track when response finishes
  res.on('finish', () => {
    performanceMonitor.trackRequest(req, res, startTime);
  });

  next();
};

// Error handling middleware
const errorHandlerMiddleware = (err, req, res, next) => {
  const errorId = errorTracker.logError(err, { req });
  
  res.status(err.status || 500).json({
    error: {
      id: errorId,
      message: process.env.NODE_ENV === 'production' 
        ? 'Internal server error' 
        : err.message,
      timestamp: new Date().toISOString()
    }
  });
};

module.exports = {
  errorTracker,
  performanceMonitor,
  errorTrackingMiddleware,
  errorHandlerMiddleware
};
