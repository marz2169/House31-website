const express = require('express');
const cors = require('cors');
const session = require('express-session');
require('dotenv').config();

const app = express();
const PORT = process.env.ADMIN_PORT || 5001;

// Import database connection and models
const { connectDB, isDBConnected } = require('./config/database');
const Post = require('./models/Post');

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: [process.env.FRONTEND_URL || 'http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session middleware for admin authentication
app.use(session({
  secret: process.env.SESSION_SECRET || 'house31-admin-session-secret',
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

// Import admin routes
const adminRoutes = require('./routes/admin');
app.use('/', adminRoutes);

// Health check for admin server
app.get('/health', (req, res) => {
  res.json({ 
    message: 'House31 Admin Server is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: isDBConnected() ? 'connected' : 'disconnected'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Admin Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'Admin server error',
    error: err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Admin route ${req.originalUrl} not found`,
    availableRoutes: ['/', '/test', '/health']
  });
});

// Start admin server
app.listen(PORT, () => {
  console.log(`🔧 House31 Admin Server is running on port ${PORT}`);
  console.log(`📱 Admin Interface: http://localhost:${PORT}/`);
  console.log(`💻 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🗄️  Database: ${isDBConnected() ? 'Connected' : 'Disconnected'}`);
});

module.exports = app;
