const mongoose = require('mongoose');
require('dotenv').config();
const Post = require('../models/Post');
const connectDB = require('../config/database');

const samplePosts = [
  {
    title: "Breaking: Major Technology Breakthrough Announced",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    excerpt: "A groundbreaking technology announcement that will change the industry forever.",
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
    title: "Latest Entertainment News and Updates",
    content: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
    excerpt: "Stay up to date with the latest happenings in the entertainment world.",
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
    title: "Amazing Video Content You Don't Want to Miss",
    content: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
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

async function seedDatabase() {
  try {
    // Connect to database
    await connectDB();
    
    // Clear existing posts
    await Post.deleteMany({});
    console.log('Cleared existing posts');
    
    // Insert sample posts
    const createdPosts = await Post.insertMany(samplePosts);
    console.log(`Created ${createdPosts.length} sample posts`);
    
    // Display created posts
    createdPosts.forEach((post, index) => {
      console.log(`${index + 1}. ${post.title} (${post.slug}) - ${post.category}`);
    });
    
    console.log('\nDatabase seeding completed successfully!');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the seeder if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, samplePosts };
