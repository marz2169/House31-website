const express = require('express');
const { errorTracker, performanceMonitor } = require('./error-tracker');
const router = express.Router();

// Dashboard overview
router.get('/dashboard', (req, res) => {
  const dashboard = {
    timestamp: new Date().toISOString(),
    system: {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      platform: process.platform,
      nodeVersion: process.version,
      environment: process.env.NODE_ENV
    },
    errors: errorTracker.getStats(),
    performance: performanceMonitor.getStats(),
    database: {
      // Add database connection status
      connected: require('mongoose').connection.readyState === 1
    }
  };

  res.json(dashboard);
});

// Error logs endpoint
router.get('/errors', (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  const errors = errorTracker.getRecentErrors(limit);
  
  res.json({
    errors,
    stats: errorTracker.getStats()
  });
});

// Performance metrics endpoint
router.get('/performance', (req, res) => {
  const stats = performanceMonitor.getStats();
  res.json(stats);
});

// Health summary endpoint
router.get('/health-summary', (req, res) => {
  const errorStats = errorTracker.getStats();
  const perfStats = performanceMonitor.getStats();
  
  const health = {
    timestamp: new Date().toISOString(),
    status: 'healthy',
    score: 100,
    checks: {
      uptime: {
        status: process.uptime() > 60 ? 'pass' : 'warn',
        value: process.uptime(),
        threshold: 60
      },
      memory: {
        status: process.memoryUsage().heapUsed < 500 * 1024 * 1024 ? 'pass' : 'warn',
        value: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        threshold: 500,
        unit: 'MB'
      },
      errors: {
        status: errorStats.lastHour < 10 ? 'pass' : 'fail',
        value: errorStats.lastHour,
        threshold: 10
      },
      responseTime: {
        status: perfStats.averageResponseTime < 500 ? 'pass' : 'warn',
        value: perfStats.averageResponseTime || 0,
        threshold: 500,
        unit: 'ms'
      }
    }
  };

  // Calculate overall health score
  const checks = Object.values(health.checks);
  const passCount = checks.filter(c => c.status === 'pass').length;
  const warnCount = checks.filter(c => c.status === 'warn').length;
  const failCount = checks.filter(c => c.status === 'fail').length;

  health.score = Math.round((passCount + warnCount * 0.5) / checks.length * 100);
  
  if (failCount > 0) {
    health.status = 'critical';
  } else if (warnCount > 0) {
    health.status = 'warning';
  }

  res.json(health);
});

// Clear errors endpoint (for admin use)
router.post('/clear-errors', (req, res) => {
  errorTracker.clearErrors();
  res.json({ message: 'Error history cleared', timestamp: new Date().toISOString() });
});

// Export system information
router.get('/system-export', (req, res) => {
  const exportData = {
    timestamp: new Date().toISOString(),
    system: {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      platform: process.platform,
      nodeVersion: process.version,
      environment: process.env.NODE_ENV
    },
    errors: errorTracker.getStats(),
    performance: performanceMonitor.getStats(),
    recentErrors: errorTracker.getRecentErrors(50)
  };

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename="house31-monitoring-export.json"');
  res.json(exportData);
});

module.exports = router;
