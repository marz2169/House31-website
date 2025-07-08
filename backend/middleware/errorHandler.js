// Global error handling middleware

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error response
  let error = {
    success: false,
    message: err.message || 'Internal Server Error',
    error: err.message
  };

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    error.message = 'Validation Error';
    error.errors = messages;
    return res.status(400).json(error);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error.message = `Duplicate ${field}`;
    error.error = `${field} already exists`;
    return res.status(400).json(error);
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    error.message = 'Invalid ID format';
    error.error = 'Resource not found';
    return res.status(404).json(error);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.message = 'Invalid token';
    error.error = 'Authentication failed';
    return res.status(401).json(error);
  }

  if (err.name === 'TokenExpiredError') {
    error.message = 'Token expired';
    error.error = 'Authentication failed';
    return res.status(401).json(error);
  }

  // Express-validator errors
  if (err.array && typeof err.array === 'function') {
    error.message = 'Validation failed';
    error.errors = err.array();
    return res.status(400).json(error);
  }

  // Default server error
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json(error);
};

// 404 handler for unknown routes
const notFound = (req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} not found`);
  error.statusCode = 404;
  next(error);
};

// Async error handler wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  errorHandler,
  notFound,
  asyncHandler
};
