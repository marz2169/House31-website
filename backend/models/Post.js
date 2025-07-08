const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  slug: {
    type: String,
    unique: true,
    sparse: true, // Allow null values but ensure uniqueness for non-null
    lowercase: true,
    trim: true,
    match: [/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens']
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  excerpt: {
    type: String,
    maxlength: [500, 'Excerpt cannot exceed 500 characters']
  },
  coverImage: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i.test(v);
      },
      message: 'Cover image must be a valid URL ending with jpg, jpeg, png, webp, or gif'
    }
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['news', 'videos', 'entertainment'],
    lowercase: true
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  author: {
    name: {
      type: String,
      required: [true, 'Author name is required'],
      trim: true
    },
    email: {
      type: String,
      validate: {
        validator: function(v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: 'Please provide a valid email address'
      }
    },
    avatar: String
  },
  isTrending: {
    type: Boolean,
    default: false
  },
  isHero: {
    type: Boolean,
    default: false
  },
  viewCount: {
    type: Number,
    default: 0,
    min: 0
  },
  likeCount: {
    type: Number,
    default: 0,
    min: 0
  },
  shareCount: {
    type: Number,
    default: 0,
    min: 0
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  publishedAt: {
    type: Date,
    default: null
  },
  video: {
    url: {
      type: String,
      validate: {
        validator: function(v) {
          return !v || /^https?:\/\/(www\.)?(youtube\.com|youtu\.be|vimeo\.com)/.test(v);
        },
        message: 'Video URL must be from YouTube or Vimeo'
      }
    },
    thumbnail: String,
    duration: String // e.g., "10:30"
  },
  seo: {
    metaTitle: {
      type: String,
      maxlength: [60, 'Meta title cannot exceed 60 characters']
    },
    metaDescription: {
      type: String,
      maxlength: [160, 'Meta description cannot exceed 160 characters']
    },
    keywords: [String]
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
postSchema.index({ category: 1 });
postSchema.index({ isTrending: 1 });
postSchema.index({ status: 1 });
postSchema.index({ publishedAt: -1 });
postSchema.index({ createdAt: -1 });
postSchema.index({ 'author.name': 1 });

// Text search indexes for full-text search
postSchema.index({
  title: 'text',
  excerpt: 'text',
  content: 'text',
  tags: 'text'
}, {
  weights: {
    title: 10,
    excerpt: 5,
    tags: 3,
    content: 1
  },
  name: 'text_search_index'
});

// Compound indexes
postSchema.index({ category: 1, status: 1, publishedAt: -1 });
postSchema.index({ isTrending: 1, status: 1, publishedAt: -1 });

// Virtual for URL
postSchema.virtual('url').get(function() {
  return `/post/${this.slug}`;
});

// Virtual for reading time (assuming 200 words per minute)
postSchema.virtual('readingTime').get(function() {
  const wordCount = this.content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);
  return `${readingTime} min read`;
});

// Pre-validate middleware to auto-generate slug from title if not provided
postSchema.pre('validate', function(next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim('-'); // Remove leading/trailing hyphens
  }
  next();
});

// Pre-save middleware to set publishedAt when status changes to published
postSchema.pre('save', function(next) {
  // Set publishedAt when status changes to published
  if (this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  next();
});

// Static methods
postSchema.statics.findByCategory = function(category) {
  return this.find({ category, status: 'published' })
    .sort({ publishedAt: -1 });
};

postSchema.statics.findTrending = function(limit = 10) {
  return this.find({ isTrending: true, status: 'published' })
    .sort({ publishedAt: -1 })
    .limit(limit);
};

postSchema.statics.findHero = function() {
  return this.findOne({ isHero: true, status: 'published' })
    .sort({ publishedAt: -1 });
};

// Instance methods
postSchema.methods.incrementView = function() {
  this.viewCount += 1;
  return this.save();
};

postSchema.methods.toggleTrending = function() {
  this.isTrending = !this.isTrending;
  return this.save();
};

module.exports = mongoose.model('Post', postSchema);
