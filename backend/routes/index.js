const express = require('express');
const router = express.Router();

// Import route modules
const postsRoutes = require('./posts');

// API routes
router.use('/posts', postsRoutes);

// API info route
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'House31 Website API',
    version: '1.0.0',
    endpoints: {
      posts: {
        'GET /api/posts': 'Get all posts with filtering and pagination',
        'GET /api/posts?category=X': 'Get posts by category with pagination',
        'GET /api/posts/trending': 'Get trending posts',
        'GET /api/posts/hero': 'Get hero post',
        'GET /api/posts/search': 'Search posts',
        'GET /api/posts/:slug': 'Get post by slug',
        'POST /api/posts': 'Create post (admin)',
        'PUT /api/posts/:id': 'Update post (admin)',
        'DELETE /api/posts/:id': 'Delete post (admin)',
        'PUT /api/posts/:id/toggle-trending': 'Toggle trending status (admin)'
      }
    },
    documentation: 'https://github.com/house31/website-api'
  });
});

module.exports = router;
