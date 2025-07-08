const mongoose = require('mongoose');
const Post = require('../models/Post');

// Load environment variables
require('dotenv').config();

// Database connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/house31', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

// Function to create/update search indexes
const createSearchIndexes = async () => {
  try {
    console.log('Creating search indexes...');
    
    // Drop existing text indexes to avoid conflicts
    try {
      await Post.collection.dropIndex('text_search_index');
      console.log('Dropped existing text search index');
    } catch (error) {
      // Index doesn't exist, which is fine
      console.log('No existing text search index to drop');
    }
    
    // Create new text search index
    await Post.collection.createIndex({
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
    
    console.log('Text search index created successfully');
    
    // List all indexes to verify
    const indexes = await Post.collection.listIndexes().toArray();
    console.log('Current indexes:');
    indexes.forEach(index => {
      console.log(`  - ${index.name}: ${JSON.stringify(index.key)}`);
    });
    
  } catch (error) {
    console.error('Error creating search indexes:', error);
    throw error;
  }
};

// Test search functionality
const testSearch = async () => {
  try {
    console.log('\nTesting search functionality...');
    
    // Test text search
    const textSearchResults = await Post.find({
      $text: { $search: 'news' },
      status: 'published'
    }).limit(3);
    
    console.log(`Text search for 'news' found ${textSearchResults.length} results`);
    
    // Test regex search (fallback)
    const regexSearchResults = await Post.find({
      status: 'published',
      $or: [
        { title: { $regex: 'news', $options: 'i' } },
        { excerpt: { $regex: 'news', $options: 'i' } },
        { tags: { $in: [/news/i] } }
      ]
    }).limit(3);
    
    console.log(`Regex search for 'news' found ${regexSearchResults.length} results`);
    
  } catch (error) {
    console.error('Error testing search:', error);
  }
};

// Main execution
const main = async () => {
  try {
    await connectDB();
    await createSearchIndexes();
    await testSearch();
    
    console.log('\nSearch index setup completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Setup failed:', error);
    process.exit(1);
  }
};

// Run if this file is executed directly
if (require.main === module) {
  main();
}

module.exports = {
  createSearchIndexes,
  testSearch
};
