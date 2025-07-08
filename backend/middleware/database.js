const { isDBConnected } = require('../config/database');

// Middleware to check if database is connected
const requireDB = (req, res, next) => {
  if (!isDBConnected()) {
    return res.status(503).json({
      success: false,
      message: 'Database not available',
      error: 'MongoDB connection is required for this operation'
    });
  }
  next();
};

module.exports = {
  requireDB
};
