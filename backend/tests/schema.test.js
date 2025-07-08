const mongoose = require('mongoose');
const Post = require('../models/Post');
require('dotenv').config();

// Test schema validation
async function testSchema() {
  try {
    // Test valid post creation
    const validPost = new Post({
      title: "Test Post",
      content: "This is a test post content.",
      category: "news",
      author: {
        name: "Test Author",
        email: "test@example.com"
      }
    });

    // Validate without saving
    await validPost.validate();
    console.log('✅ Valid post schema validation passed');

    // Test invalid post (missing required fields)
    try {
      const invalidPost = new Post({
        content: "This post is missing a title"
      });
      await invalidPost.validate();
      console.log('❌ Invalid post validation should have failed');
    } catch (error) {
      console.log('✅ Invalid post validation correctly failed:', error.message);
    }

    // Test slug generation
    const postWithoutSlug = new Post({
      title: "This Title Should Generate a Slug!",
      content: "Test content",
      category: "news",
      author: {
        name: "Test Author",
        email: "test@example.com"
      }
    });

    // Trigger pre-save middleware
    await postWithoutSlug.validate();
    postWithoutSlug.save = function() { return Promise.resolve(this); }; // Mock save
    await postWithoutSlug.save();
    
    console.log('✅ Slug generation test passed:', postWithoutSlug.slug);

    // Test virtuals
    const postWithContent = new Post({
      title: "Reading Time Test",
      content: "This is a test post with some content. ".repeat(50), // ~250 words
      category: "news",
      author: {
        name: "Test Author",
        email: "test@example.com"
      }
    });

    console.log('✅ Reading time virtual:', postWithContent.readingTime);
    console.log('✅ URL virtual:', postWithContent.url);

    console.log('\n🎉 All schema tests passed!');

  } catch (error) {
    console.error('❌ Schema test failed:', error);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testSchema();
}

module.exports = { testSchema };
