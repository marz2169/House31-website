const express = require('express');
const cors = require('cors');
const session = require('express-session');
require('dotenv').config();

// Import database connection
const { connectDB, isDBConnected } = require('./config/database');

// Import models
const Post = require('./models/Post');

// Import routes
const apiRoutes = require('./routes');
const adminRoutes = require('./routes/admin');

// Import middleware
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Import monitoring
const { errorTrackingMiddleware, errorHandlerMiddleware } = require('./monitoring/error-tracker');
const monitoringRoutes = require('./monitoring/dashboard-routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session middleware for admin authentication
app.use(session({
  secret: process.env.SESSION_SECRET || 'house31-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Error tracking middleware
app.use(errorTrackingMiddleware);

// Routes
app.use('/api', apiRoutes);
app.use('/admin', adminRoutes);
app.use('/monitoring', monitoringRoutes);

// Basic health check route
app.get('/health', async (req, res) => {
  try {
    const dbConnected = isDBConnected();
    res.json({ 
      message: 'House31 Backend API is running!',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: dbConnected ? 'connected' : 'disconnected',
      uptime: process.uptime(),
      memory: process.memoryUsage()
    });
  } catch (error) {
    res.status(503).json({
      message: 'Health check failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Test database connection route
app.get('/api/test-db', async (req, res) => {
  try {
    if (!isDBConnected()) {
      return res.status(503).json({ 
        message: 'Database not connected',
        error: 'MongoDB connection not available',
        connected: false
      });
    }
    
    const count = await Post.countDocuments();
    res.json({ 
      message: 'Database connection successful',
      postsCount: count,
      connected: true,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Database connection failed',
      error: error.message,
      connected: false
    });
  }
});

// 404 handler
app.use(notFound);

// Error handling middleware
app.use(errorHandlerMiddleware);
app.use(errorHandler);

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log(`API endpoints available at: http://localhost:${PORT}/api`);
});

module.exports = app;
