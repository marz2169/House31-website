const { validationResult } = require('express-validator');
const Post = require('../models/Post');

// Helper function to handle validation errors
const handleValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  return null;
};

// Helper function to format post response
const formatPostResponse = (post) => {
  if (!post) return null;
  
  const postObj = post.toObject();
  return {
    ...postObj,
    url: post.url,
    readingTime: post.readingTime
  };
};

// GET /api/posts - Get all posts with filtering and pagination
exports.getAllPosts = async (req, res) => {
  try {
    const {
      category,
      status = 'published',
      page = 1,
      limit = 10,
      sort = '-publishedAt',
      search
    } = req.query;

    // Build query
    const query = { status };
    
    if (category) {
      query.category = category.toLowerCase();
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query
    const posts = await Post.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get total count for pagination
    const total = await Post.countDocuments(query);
    
    res.json({
      success: true,
      data: {
        posts: posts.map(post => ({
          ...post,
          url: `/post/${post.slug}`,
          readingTime: `${Math.ceil(post.content.split(/\s+/).length / 200)} min read`
        })),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch posts',
      error: error.message
    });
  }
};

// GET /api/posts/category/:category - Get posts by category with pagination
exports.getPostsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const {
      status = 'published',
      page = 1,
      limit = 12,
      sort = '-publishedAt'
    } = req.query;

    // Build query
    const query = { 
      status,
      category: category.toLowerCase()
    };

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get posts and total count
    const [posts, total] = await Promise.all([
      Post.find(query)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .populate('author', 'name')
        .select('-content'), // Exclude full content for list view
      Post.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: {
        posts: posts.map(post => ({
          ...post.toObject(),
          url: `/post/${post.slug}`,
          readingTime: `${Math.ceil(post.content?.split(/\s+/).length / 200) || 1} min read`
        })),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Error fetching posts by category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch posts by category',
      error: error.message
    });
  }
};

// GET /api/posts/:slug - Get a single post by slug
exports.getPostBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    
    const post = await Post.findOne({ 
      slug, 
      status: 'published' 
    });
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Increment view count
    await post.incrementView();
    
    res.json({
      success: true,
      data: formatPostResponse(post)
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch post',
      error: error.message
    });
  }
};

// GET /api/trending - Get trending posts
exports.getTrendingPosts = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const posts = await Post.findTrending(parseInt(limit));
    
    res.json({
      success: true,
      data: posts.map(post => formatPostResponse(post))
    });
  } catch (error) {
    console.error('Error fetching trending posts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch trending posts',
      error: error.message
    });
  }
};

// GET /api/hero - Get hero post
exports.getHeroPost = async (req, res) => {
  try {
    const post = await Post.findHero();
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'No hero post found'
      });
    }
    
    res.json({
      success: true,
      data: formatPostResponse(post)
    });
  } catch (error) {
    console.error('Error fetching hero post:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch hero post',
      error: error.message
    });
  }
};

// POST /api/posts - Create a new post (Admin only)
exports.createPost = async (req, res) => {
  try {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return validationError;

    const postData = req.body;
    
    // If no slug provided, it will be auto-generated from title
    const post = new Post(postData);
    await post.save();
    
    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: formatPostResponse(post)
    });
  } catch (error) {
    console.error('Error creating post:', error);
    
    // Handle duplicate slug error
    if (error.code === 11000 && error.keyPattern?.slug) {
      return res.status(400).json({
        success: false,
        message: 'A post with this slug already exists',
        error: 'Duplicate slug'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create post',
      error: error.message
    });
  }
};

// PUT /api/posts/:id - Update a post (Admin only)
exports.updatePost = async (req, res) => {
  try {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return validationError;

    const { id } = req.params;
    const updateData = req.body;
    
    const post = await Post.findByIdAndUpdate(
      id,
      updateData,
      { 
        new: true, 
        runValidators: true 
      }
    );
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Post updated successfully',
      data: formatPostResponse(post)
    });
  } catch (error) {
    console.error('Error updating post:', error);
    
    // Handle duplicate slug error
    if (error.code === 11000 && error.keyPattern?.slug) {
      return res.status(400).json({
        success: false,
        message: 'A post with this slug already exists',
        error: 'Duplicate slug'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update post',
      error: error.message
    });
  }
};

// DELETE /api/posts/:id - Delete a post (Admin only)
exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    
    const post = await Post.findByIdAndDelete(id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Post deleted successfully',
      data: { id }
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete post',
      error: error.message
    });
  }
};

// PUT /api/posts/:id/toggle-trending - Toggle trending status (Admin only)
exports.toggleTrending = async (req, res) => {
  try {
    const { id } = req.params;
    
    const post = await Post.findById(id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    await post.toggleTrending();
    
    res.json({
      success: true,
      message: `Post ${post.isTrending ? 'added to' : 'removed from'} trending`,
      data: formatPostResponse(post)
    });
  } catch (error) {
    console.error('Error toggling trending status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle trending status',
      error: error.message
    });
  }
};

// GET /api/posts/search - Advanced search functionality
exports.searchPosts = async (req, res) => {
  try {
    const {
      q: query,
      category,
      page = 1,
      limit = 10,
      sort = '-publishedAt'
    } = req.query;

    if (!query || query.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    // Build search query with text search and regex fallback
    const searchQuery = {
      status: 'published',
      $and: []
    };

    // Add category filter if specified
    if (category) {
      searchQuery.category = category.toLowerCase();
    }

    // Try MongoDB text search first (requires text indexes)
    const textSearchQuery = {
      ...searchQuery,
      $text: { $search: query }
    };

    // Fallback regex search for title, excerpt, and tags
    const regexSearchQuery = {
      ...searchQuery,
      $and: [
        {
          $or: [
            { title: { $regex: query, $options: 'i' } },
            { excerpt: { $regex: query, $options: 'i' } },
            { tags: { $in: [new RegExp(query, 'i')] } }
          ]
        }
      ]
    };

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    let posts = [];
    let total = 0;

    try {
      // Try text search first
      posts = await Post.find(textSearchQuery)
        .sort({ score: { $meta: 'textScore' }, ...sort })
        .skip(skip)
        .limit(parseInt(limit))
        .lean();
      
      total = await Post.countDocuments(textSearchQuery);
    } catch (textSearchError) {
      // Fallback to regex search if text indexes don't exist
      console.log('Text search failed, using regex search:', textSearchError.message);
      
      posts = await Post.find(regexSearchQuery)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .lean();
      
      total = await Post.countDocuments(regexSearchQuery);
    }

    // Format results
    const formattedPosts = posts.map(post => ({
      ...post,
      url: `/post/${post.slug}`,
      readingTime: `${Math.ceil(post.content.split(/\s+/).length / 200)} min read`
    }));

    res.json({
      success: true,
      data: {
        posts: formattedPosts,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        },
        searchQuery: query,
        resultsCount: total
      }
    });
  } catch (error) {
    console.error('Error searching posts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search posts',
      error: error.message
    });
  }
};
