// API Testing Script for House31 Backend
// Run this script to test all API endpoints

const API_BASE_URL = 'http://localhost:5000/api';
const ADMIN_API_KEY = 'house31-admin-key-2024';

// Helper function to make HTTP requests
async function makeRequest(method, endpoint, data = null, requiresAuth = false) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (requiresAuth) {
    headers['x-api-key'] = ADMIN_API_KEY;
  }
  
  const config = {
    method,
    headers,
  };
  
  if (data && (method === 'POST' || method === 'PUT')) {
    config.body = JSON.stringify(data);
  }
  
  try {
    const response = await fetch(url, config);
    const result = await response.json();
    
    console.log(`${method} ${endpoint}:`, {
      status: response.status,
      success: result.success,
      message: result.message || 'No message',
      dataLength: result.data ? (Array.isArray(result.data) ? result.data.length : 'object') : 'no data'
    });
    
    return { response, result };
  } catch (error) {
    console.error(`${method} ${endpoint} failed:`, error.message);
    return { error };
  }
}

// Test data for creating posts
const testPosts = [
  {
    title: "Breaking News: Technology Breakthrough",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. " +
             "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. " +
             "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris " +
             "nisi ut aliquip ex ea commodo consequat. ".repeat(5),
    excerpt: "A groundbreaking technology announcement that will change everything.",
    category: "news",
    author: {
      name: "John Doe",
      email: "john@house31.com"
    },
    isTrending: true,
    isHero: true,
    status: "published",
    tags: ["technology", "breakthrough", "innovation"]
  },
  {
    title: "Latest Entertainment Updates",
    content: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem " +
             "accusantium doloremque laudantium, totam rem aperiam, eaque ipsa " +
             "quae ab illo inventore veritatis et quasi architecto beatae vitae " +
             "dicta sunt explicabo. ".repeat(4),
    excerpt: "Stay updated with the latest entertainment news and celebrity gossip.",
    category: "entertainment",
    author: {
      name: "Jane Smith",
      email: "jane@house31.com"
    },
    isTrending: true,
    status: "published",
    tags: ["entertainment", "celebrity", "movies"]
  },
  {
    title: "Amazing Video Content Highlights",
    content: "At vero eos et accusamus et iusto odio dignissimos ducimus qui " +
             "blanditiis praesentium voluptatum deleniti atque corrupti quos " +
             "dolores et quas molestias excepturi sint occaecati cupiditate. ".repeat(3),
    excerpt: "Check out these incredible video highlights from this week.",
    category: "videos",
    author: {
      name: "Mike Johnson",
      email: "mike@house31.com"
    },
    status: "published",
    video: {
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      duration: "3:32"
    },
    tags: ["video", "highlights", "weekly"]
  }
];

async function runAPITests() {
  console.log('🚀 Starting API Tests for House31 Backend\n');
  
  // Test API info endpoint
  console.log('=== Testing API Info ===');
  await makeRequest('GET', '/');
  
  // Test health endpoint
  console.log('\n=== Testing Health Check ===');
  await makeRequest('GET', '../health'); // health is not under /api
  
  console.log('\n=== Testing Database Connection ===');
  await makeRequest('GET', '/test-db');
  
  console.log('\n=== Testing Posts CRUD Operations ===');
  
  // Test GET all posts (empty initially)
  await makeRequest('GET', '/posts');
  
  // Test GET trending posts (empty initially)
  await makeRequest('GET', '/posts/trending');
  
  // Test GET hero post (empty initially)
  await makeRequest('GET', '/posts/hero');
  
  console.log('\n=== Creating Test Posts ===');
  const createdPosts = [];
  
  for (let i = 0; i < testPosts.length; i++) {
    const { response, result } = await makeRequest('POST', '/posts', testPosts[i], true);
    if (result && result.success && result.data) {
      createdPosts.push(result.data);
    }
  }
  
  if (createdPosts.length > 0) {
    console.log(`\n✅ Created ${createdPosts.length} test posts`);
    
    // Test GET all posts (should have data now)
    console.log('\n=== Testing GET Endpoints with Data ===');
    await makeRequest('GET', '/posts');
    await makeRequest('GET', '/posts?category=news');
    await makeRequest('GET', '/posts?limit=2');
    await makeRequest('GET', '/posts/trending');
    await makeRequest('GET', '/posts/hero');
    
    // Test GET post by slug
    if (createdPosts[0].slug) {
      await makeRequest('GET', `/posts/${createdPosts[0].slug}`);
    }
    
    // Test UPDATE post
    console.log('\n=== Testing UPDATE Operations ===');
    if (createdPosts[0]._id) {
      await makeRequest('PUT', `/posts/${createdPosts[0]._id}`, {
        title: "Updated: " + createdPosts[0].title,
        content: "This post has been updated with new content."
      }, true);
    }
    
    // Test toggle trending
    if (createdPosts[1]._id) {
      await makeRequest('PUT', `/posts/${createdPosts[1]._id}/toggle-trending`, {}, true);
    }
    
    // Test DELETE post
    console.log('\n=== Testing DELETE Operations ===');
    if (createdPosts[2]._id) {
      await makeRequest('DELETE', `/posts/${createdPosts[2]._id}`, null, true);
    }
  }
  
  console.log('\n=== Testing Authentication ===');
  // Test unauthorized access
  await makeRequest('POST', '/posts', testPosts[0], false); // Should fail
  
  // Test invalid API key
  const originalFetch = global.fetch;
  global.fetch = (url, config) => {
    if (config.headers['x-api-key']) {
      config.headers['x-api-key'] = 'invalid-key';
    }
    return originalFetch(url, config);
  };
  await makeRequest('POST', '/posts', testPosts[0], true); // Should fail
  global.fetch = originalFetch;
  
  console.log('\n=== Testing Validation ===');
  // Test invalid post data
  await makeRequest('POST', '/posts', {
    title: '', // Empty title
    content: 'Valid content',
    category: 'invalid-category', // Invalid category
    author: { name: '' } // Empty author name
  }, true);
  
  console.log('\n🎉 API Tests Completed!');
}

// Only run if this file is executed directly
if (typeof window === 'undefined' && require.main === module) {
  // Node.js environment
  const fetch = require('node-fetch');
  global.fetch = fetch;
  
  runAPITests().catch(console.error);
}

module.exports = { runAPITests, makeRequest, testPosts };
