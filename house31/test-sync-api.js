// Test script for Facebook sync API endpoint
// Run with: node test-sync-api.js

const testData = {
  posts: [
    {
      id: "test_post_1",
      title: "Breaking: AI Revolution in Military Technology",
      thumbnailUrl: "https://picsum.photos/400/225?random=100",
      description: "Revolutionary AI technology is transforming modern military operations. This breakthrough could change the future of defense systems worldwide.",
      videoLink: "https://example.com/video/1",
      postDate: "2025-01-08T10:00:00Z",
      postUrl: "https://facebook.com/house31/posts/test1",
      type: "video"
    },
    {
      id: "test_post_2", 
      title: "Space News: Mars Mission Updates",
      thumbnailUrl: "https://picsum.photos/400/225?random=101",
      description: "Latest updates from NASA's Mars exploration mission reveal groundbreaking discoveries about the red planet.",
      videoLink: null,
      postDate: "2025-01-08T08:30:00Z",
      postUrl: "https://facebook.com/house31/posts/test2",
      type: "link"
    },
    {
      id: "test_post_3",
      title: "Conspiracy Theory: Government Tech Secrets",
      thumbnailUrl: "https://picsum.photos/400/225?random=102", 
      description: "Leaked documents reveal classified technology projects that could reshape our understanding of government capabilities.",
      videoLink: "https://example.com/video/3",
      postDate: "2025-01-08T06:15:00Z",
      postUrl: "https://facebook.com/house31/posts/test3",
      type: "video"
    }
  ],
  source: "facebook",
  workflowId: "test-workflow"
};

async function testSyncAPI() {
  const apiUrl = 'http://localhost:3004/api/sync';
  
  console.log('🧪 Testing House31 Sync API...\n');
  
  try {
    // Test POST endpoint
    console.log('📤 Testing POST /api/sync');
    const postResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    const postResult = await postResponse.json();
    console.log('✅ POST Response:', postResult);
    
    // Wait a moment then test GET endpoint
    console.log('\n📥 Testing GET /api/sync');
    const getResponse = await fetch(apiUrl);
    const getResult = await getResponse.json();
    console.log('✅ GET Response:', getResult);
    
    console.log('\n🎉 API test completed successfully!');
    
  } catch (error) {
    console.error('❌ API test failed:', error.message);
    console.log('\n💡 Make sure your Next.js server is running on http://localhost:3004');
  }
}

// Run the test if this script is executed directly
if (require.main === module) {
  testSyncAPI();
}

module.exports = { testSyncAPI, testData };
