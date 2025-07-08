// MongoDB initialization script for Docker container
// This script runs when the MongoDB container starts for the first time

print('Starting MongoDB initialization...');

// Switch to the application database
db = db.getSiblingDB('house31-website');

// Create application user
db.createUser({
  user: 'house31user',
  pwd: 'house31userpassword',
  roles: [
    {
      role: 'readWrite',
      db: 'house31-website'
    }
  ]
});

// Create collections with validation
db.createCollection('posts', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["title", "content", "category", "author"],
      properties: {
        title: {
          bsonType: "string",
          maxLength: 200,
          description: "must be a string and is required"
        },
        slug: {
          bsonType: "string",
          pattern: "^[a-z0-9-]+$",
          description: "must be a valid slug"
        },
        content: {
          bsonType: "string",
          description: "must be a string and is required"
        },
        category: {
          bsonType: "string",
          enum: ["news", "videos", "entertainment"],
          description: "must be one of the enum values"
        },
        status: {
          bsonType: "string",
          enum: ["draft", "published", "archived"],
          description: "must be one of the enum values"
        }
      }
    }
  }
});

// Create indexes for better performance
db.posts.createIndex({ "slug": 1 }, { unique: true });
db.posts.createIndex({ "category": 1 });
db.posts.createIndex({ "isTrending": 1 });
db.posts.createIndex({ "status": 1 });
db.posts.createIndex({ "publishedAt": -1 });
db.posts.createIndex({ "createdAt": -1 });
db.posts.createIndex({ "author.name": 1 });

// Create compound indexes
db.posts.createIndex({ "category": 1, "status": 1, "publishedAt": -1 });
db.posts.createIndex({ "isTrending": 1, "status": 1, "publishedAt": -1 });

// Insert sample data
const samplePosts = [
  {
    title: "Welcome to House31 Website",
    slug: "welcome-to-house31-website",
    content: "This is the first post on our new website. We're excited to share news, videos, and entertainment content with you. Stay tuned for more amazing content coming your way!",
    excerpt: "Welcome to our new website featuring news, videos, and entertainment.",
    category: "news",
    author: {
      name: "House31 Team",
      email: "team@house31.com"
    },
    isTrending: true,
    isHero: true,
    status: "published",
    publishedAt: new Date(),
    tags: ["welcome", "announcement", "news"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Latest Technology Trends",
    slug: "latest-technology-trends",
    content: "Exploring the newest developments in technology and how they impact our daily lives. From AI to blockchain, we cover it all.",
    excerpt: "Stay updated with the latest technology trends and innovations.",
    category: "news",
    author: {
      name: "Tech Reporter",
      email: "tech@house31.com"
    },
    isTrending: true,
    status: "published",
    publishedAt: new Date(),
    tags: ["technology", "trends", "innovation"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Entertainment Weekly Roundup",
    slug: "entertainment-weekly-roundup",
    content: "Your weekly dose of entertainment news, celebrity updates, and movie reviews. Don't miss out on the hottest entertainment stories.",
    excerpt: "Weekly entertainment news and celebrity updates.",
    category: "entertainment",
    author: {
      name: "Entertainment Editor",
      email: "entertainment@house31.com"
    },
    status: "published",
    publishedAt: new Date(),
    tags: ["entertainment", "weekly", "celebrities"],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

db.posts.insertMany(samplePosts);

print('MongoDB initialization completed successfully!');
print('Database: house31-website');
print('User: house31user created');
print('Collections: posts created with indexes');
print('Sample data: ' + samplePosts.length + ' posts inserted');
