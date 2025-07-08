const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.HEALTH_PORT || 3001;

// Health check endpoint
app.get('/health', async (req, res) => {
  const healthCheck = {
    timestamp: new Date().toISOString(),
    status: 'OK',
    services: {
      api: 'healthy',
      database: 'checking...',
      memory: process.memoryUsage(),
      uptime: process.uptime()
    }
  };

  try {
    // Check database connection
    if (mongoose.connection.readyState === 1) {
      healthCheck.services.database = 'healthy';
    } else {
      healthCheck.services.database = 'unhealthy';
      healthCheck.status = 'DEGRADED';
    }

    // Check memory usage
    const memoryUsage = process.memoryUsage();
    const memoryUsageInMB = {
      rss: Math.round(memoryUsage.rss / 1024 / 1024),
      heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
      heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
      external: Math.round(memoryUsage.external / 1024 / 1024)
    };

    healthCheck.services.memory = memoryUsageInMB;

    // Check if memory usage is too high (> 500MB)
    if (memoryUsageInMB.heapUsed > 500) {
      healthCheck.status = 'WARNING';
      healthCheck.services.memory.warning = 'High memory usage detected';
    }

    res.status(200).json(healthCheck);
  } catch (error) {
    healthCheck.status = 'ERROR';
    healthCheck.services.database = 'error';
    healthCheck.error = error.message;
    res.status(503).json(healthCheck);
  }
});

// Detailed system information endpoint
app.get('/system-info', (req, res) => {
  const systemInfo = {
    timestamp: new Date().toISOString(),
    node: {
      version: process.version,
      platform: process.platform,
      arch: process.arch,
      pid: process.pid
    },
    environment: process.env.NODE_ENV || 'development',
    uptime: {
      process: process.uptime(),
      system: require('os').uptime()
    },
    memory: {
      usage: process.memoryUsage(),
      system: {
        total: require('os').totalmem(),
        free: require('os').freemem()
      }
    },
    cpu: {
      usage: process.cpuUsage(),
      info: require('os').cpus()
    }
  };

  res.json(systemInfo);
});

// Ready endpoint for container readiness probes
app.get('/ready', async (req, res) => {
  try {
    // Check if all required services are available
    const isReady = mongoose.connection.readyState === 1;
    
    if (isReady) {
      res.status(200).json({ 
        status: 'ready', 
        timestamp: new Date().toISOString() 
      });
    } else {
      res.status(503).json({ 
        status: 'not ready', 
        timestamp: new Date().toISOString(),
        reason: 'Database not connected'
      });
    }
  } catch (error) {
    res.status(503).json({ 
      status: 'not ready', 
      timestamp: new Date().toISOString(),
      error: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`🏥 Health check server running on port ${PORT}`);
});

module.exports = app;
