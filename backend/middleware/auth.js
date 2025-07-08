// Simple authentication middleware for admin routes
// In production, this should use JWT tokens or a proper authentication system

const authenticateAdmin = (req, res, next) => {
  // For development, we'll use a simple API key approach
  // In production, implement proper JWT authentication
  
  const apiKey = req.headers['x-api-key'] || req.headers['authorization'];
  
  // Check for API key in headers
  if (!apiKey) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No API key provided.',
      error: 'Missing authentication'
    });
  }
  
  // Simple API key validation (replace with proper authentication)
  const validApiKey = process.env.ADMIN_API_KEY || 'house31-admin-key-2024';
  
  if (apiKey !== validApiKey && apiKey !== `Bearer ${validApiKey}`) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Invalid API key.',
      error: 'Invalid authentication'
    });
  }
  
  // Add admin info to request object
  req.admin = {
    id: 'admin',
    role: 'admin'
  };
  
  next();
};

// Optional authentication (for routes that can work with or without auth)
const optionalAuth = (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.headers['authorization'];
  const validApiKey = process.env.ADMIN_API_KEY || 'house31-admin-key-2024';
  
  if (apiKey && (apiKey === validApiKey || apiKey === `Bearer ${validApiKey}`)) {
    req.admin = {
      id: 'admin',
      role: 'admin'
    };
  }
  
  next();
};

module.exports = {
  authenticateAdmin,
  optionalAuth
};
