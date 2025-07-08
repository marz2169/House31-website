const express = require('express');
const router = express.Router();

// Import controllers and middleware
const postController = require('../controllers/postController');
const { authenticateAdmin, optionalAuth } = require('../middleware/auth');
const {
  validateCreatePost,
  validateUpdatePost,
  validatePostId,
  validateSlug,
  validatePostQuery,
  validateTrendingQuery
} = require('../middleware/validation');
const { asyncHandler } = require('../middleware/errorHandler');

// Public routes
router.get('/', 
  validatePostQuery, 
  asyncHandler(postController.getAllPosts)
);

router.get('/trending', 
  validateTrendingQuery, 
  asyncHandler(postController.getTrendingPosts)
);

router.get('/hero', 
  asyncHandler(postController.getHeroPost)
);

router.get('/:slug', 
  validateSlug, 
  asyncHandler(postController.getPostBySlug)
);

router.get('/search', 
  validatePostQuery, 
  asyncHandler(postController.searchPosts)
);

// Admin routes (protected)
router.post('/', 
  authenticateAdmin,
  validateCreatePost,
  asyncHandler(postController.createPost)
);

router.put('/:id', 
  authenticateAdmin,
  validateUpdatePost,
  asyncHandler(postController.updatePost)
);

router.delete('/:id', 
  authenticateAdmin,
  validatePostId,
  asyncHandler(postController.deletePost)
);

router.put('/:id/toggle-trending', 
  authenticateAdmin,
  validatePostId,
  asyncHandler(postController.toggleTrending)
);

module.exports = router;
