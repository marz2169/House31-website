const { body, param, query } = require('express-validator');

// Validation for creating a new post
exports.validateCreatePost = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
    
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required'),
    
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
    .isIn(['news', 'videos', 'entertainment'])
    .withMessage('Category must be one of: news, videos, entertainment'),
    
  body('author.name')
    .trim()
    .notEmpty()
    .withMessage('Author name is required'),
    
  body('author.email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email address'),
    
  body('excerpt')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Excerpt cannot exceed 500 characters'),
    
  body('coverImage')
    .optional()
    .isURL()
    .withMessage('Cover image must be a valid URL'),
    
  body('slug')
    .optional()
    .matches(/^[a-z0-9-]+$/)
    .withMessage('Slug can only contain lowercase letters, numbers, and hyphens'),
    
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
    
  body('tags.*')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Tag cannot be empty'),
    
  body('status')
    .optional()
    .isIn(['draft', 'published', 'archived'])
    .withMessage('Status must be one of: draft, published, archived'),
    
  body('isTrending')
    .optional()
    .isBoolean()
    .withMessage('isTrending must be a boolean'),
    
  body('isHero')
    .optional()
    .isBoolean()
    .withMessage('isHero must be a boolean'),
    
  body('video.url')
    .optional()
    .isURL()
    .withMessage('Video URL must be a valid URL'),
    
  body('video.duration')
    .optional()
    .matches(/^\d{1,2}:\d{2}$/)
    .withMessage('Video duration must be in format MM:SS or HH:MM'),
    
  body('seo.metaTitle')
    .optional()
    .isLength({ max: 60 })
    .withMessage('Meta title cannot exceed 60 characters'),
    
  body('seo.metaDescription')
    .optional()
    .isLength({ max: 160 })
    .withMessage('Meta description cannot exceed 160 characters'),
    
  body('seo.keywords')
    .optional()
    .isArray()
    .withMessage('SEO keywords must be an array')
];

// Validation for updating a post
exports.validateUpdatePost = [
  param('id')
    .isMongoId()
    .withMessage('Invalid post ID'),
    
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
    
  body('content')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Content cannot be empty'),
    
  body('category')
    .optional()
    .trim()
    .isIn(['news', 'videos', 'entertainment'])
    .withMessage('Category must be one of: news, videos, entertainment'),
    
  body('author.name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Author name cannot be empty'),
    
  body('author.email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email address'),
    
  body('excerpt')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Excerpt cannot exceed 500 characters'),
    
  body('coverImage')
    .optional()
    .isURL()
    .withMessage('Cover image must be a valid URL'),
    
  body('slug')
    .optional()
    .matches(/^[a-z0-9-]+$/)
    .withMessage('Slug can only contain lowercase letters, numbers, and hyphens'),
    
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
    
  body('status')
    .optional()
    .isIn(['draft', 'published', 'archived'])
    .withMessage('Status must be one of: draft, published, archived'),
    
  body('isTrending')
    .optional()
    .isBoolean()
    .withMessage('isTrending must be a boolean'),
    
  body('isHero')
    .optional()
    .isBoolean()
    .withMessage('isHero must be a boolean'),
    
  body('video.url')
    .optional()
    .isURL()
    .withMessage('Video URL must be a valid URL'),
    
  body('seo.metaTitle')
    .optional()
    .isLength({ max: 60 })
    .withMessage('Meta title cannot exceed 60 characters'),
    
  body('seo.metaDescription')
    .optional()
    .isLength({ max: 160 })
    .withMessage('Meta description cannot exceed 160 characters')
];

// Validation for route parameters
exports.validatePostId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid post ID')
];

exports.validateSlug = [
  param('slug')
    .matches(/^[a-z0-9-]+$/)
    .withMessage('Invalid slug format')
];

// Validation for query parameters
exports.validatePostQuery = [
  query('category')
    .optional()
    .isIn(['news', 'videos', 'entertainment'])
    .withMessage('Category must be one of: news, videos, entertainment'),
    
  query('status')
    .optional()
    .isIn(['draft', 'published', 'archived'])
    .withMessage('Status must be one of: draft, published, archived'),
    
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
    
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
    
  query('sort')
    .optional()
    .isIn([
      'createdAt', '-createdAt',
      'updatedAt', '-updatedAt',
      'publishedAt', '-publishedAt',
      'title', '-title',
      'viewCount', '-viewCount'
    ])
    .withMessage('Invalid sort parameter'),
    
  query('search')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search term must be between 1 and 100 characters')
];

exports.validateTrendingQuery = [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50')
];
