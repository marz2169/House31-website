const express = require('express');
const router = express.Router();

console.log('Admin routes file loaded');

// Simple authentication middleware for admin interface
const adminAuth = (req, res, next) => {
  // Check if already authenticated via session/cookie
  if (req.session && req.session.adminAuthenticated) {
    return next();
  }
  
  // Check for basic auth in request
  const auth = req.headers.authorization;
  if (auth) {
    const token = auth.split(' ')[1];
    const decoded = Buffer.from(token, 'base64').toString();
    const [username, password] = decoded.split(':');
    
    // Simple credentials check (in production, use proper authentication)
    if (username === 'admin' && password === (process.env.ADMIN_PASSWORD || 'house31admin')) {
      if (req.session) req.session.adminAuthenticated = true;
      return next();
    }
  }
  
  // Send authentication challenge
  res.setHeader('WWW-Authenticate', 'Basic realm="House31 Admin"');
  res.status(401).send('Authentication required');
};

// Admin interface routes
// Simple test route
router.get('/test', (req, res) => {
  res.json({ message: 'Admin routes are working!' });
});

// GET /admin - Admin dashboard
router.get('/', adminAuth, (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>House31 Admin</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
            .form-input {
                @apply w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent;
            }
            .btn-primary {
                @apply bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200;
            }
            .btn-secondary {
                @apply bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200;
            }
            .btn-danger {
                @apply bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200;
            }
        </style>
    </head>
    <body class="bg-gray-100 min-h-screen">
        <div class="container mx-auto px-4 py-8">
            <div class="max-w-6xl mx-auto">
                <h1 class="text-3xl font-bold text-gray-800 mb-8">House31 Admin Dashboard</h1>
                
                <!-- Navigation Tabs -->
                <div class="mb-6">
                    <div class="flex space-x-4 border-b">
                        <button onclick="showTab('add')" id="add-tab" class="px-4 py-2 border-b-2 border-blue-500 text-blue-600 font-medium">Add Post</button>
                        <button onclick="showTab('manage')" id="manage-tab" class="px-4 py-2 text-gray-600 hover:text-blue-600 font-medium">Manage Posts</button>
                    </div>
                </div>

                <!-- Add Post Form -->
                <div id="add-post" class="bg-white rounded-lg shadow-md p-6">
                    <h2 class="text-2xl font-bold text-gray-800 mb-6">Add New Post</h2>
                    <form id="add-post-form" class="space-y-4">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-gray-700 text-sm font-bold mb-2">Title *</label>
                                <input type="text" name="title" required class="form-input" placeholder="Enter post title">
                            </div>
                            <div>
                                <label class="block text-gray-700 text-sm font-bold mb-2">Category *</label>
                                <select name="category" required class="form-input">
                                    <option value="">Select category</option>
                                    <option value="news">News</option>
                                    <option value="videos">Videos</option>
                                    <option value="entertainment">Entertainment</option>
                                </select>
                            </div>
                        </div>
                        
                        <div>
                            <label class="block text-gray-700 text-sm font-bold mb-2">Excerpt</label>
                            <textarea name="excerpt" rows="2" class="form-input" placeholder="Brief description of the post"></textarea>
                        </div>
                        
                        <div>
                            <label class="block text-gray-700 text-sm font-bold mb-2">Content *</label>
                            <textarea name="content" rows="6" required class="form-input" placeholder="Full post content"></textarea>
                        </div>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-gray-700 text-sm font-bold mb-2">Featured Image URL</label>
                                <input type="url" name="featuredImage" class="form-input" placeholder="https://example.com/image.jpg">
                            </div>
                            <div>
                                <label class="block text-gray-700 text-sm font-bold mb-2">Video URL (for video posts)</label>
                                <input type="url" name="videoUrl" class="form-input" placeholder="https://youtube.com/watch?v=...">
                            </div>
                        </div>
                        
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label class="block text-gray-700 text-sm font-bold mb-2">Author Name</label>
                                <input type="text" name="authorName" class="form-input" placeholder="Author name" value="House31 Admin">
                            </div>
                            <div>
                                <label class="block text-gray-700 text-sm font-bold mb-2">Author Email</label>
                                <input type="email" name="authorEmail" class="form-input" placeholder="author@house31.com" value="admin@house31.com">
                            </div>
                            <div>
                                <label class="block text-gray-700 text-sm font-bold mb-2">Tags (comma-separated)</label>
                                <input type="text" name="tags" class="form-input" placeholder="tag1, tag2, tag3">
                            </div>
                        </div>
                        
                        <div class="flex items-center space-x-4">
                            <label class="flex items-center">
                                <input type="checkbox" name="isTrending" class="mr-2">
                                <span class="text-gray-700">Mark as Trending</span>
                            </label>
                            <label class="flex items-center">
                                <input type="checkbox" name="isHero" class="mr-2">
                                <span class="text-gray-700">Set as Hero Post</span>
                            </label>
                        </div>
                        
                        <div class="flex space-x-4">
                            <button type="submit" class="btn-primary">Create Post</button>
                            <button type="reset" class="btn-secondary">Clear Form</button>
                        </div>
                    </form>
                </div>

                <!-- Manage Posts -->
                <div id="manage-posts" class="bg-white rounded-lg shadow-md p-6 hidden">
                    <h2 class="text-2xl font-bold text-gray-800 mb-6">Manage Posts</h2>
                    <div id="posts-list" class="space-y-4">
                        <div class="text-center text-gray-500">Loading posts...</div>
                    </div>
                </div>
            </div>
        </div>

        <script>
            const API_BASE = window.location.origin + '/api';
            
            function showTab(tab) {
                // Hide all tabs
                document.getElementById('add-post').classList.add('hidden');
                document.getElementById('manage-posts').classList.add('hidden');
                
                // Reset tab styles
                document.getElementById('add-tab').className = 'px-4 py-2 text-gray-600 hover:text-blue-600 font-medium';
                document.getElementById('manage-tab').className = 'px-4 py-2 text-gray-600 hover:text-blue-600 font-medium';
                
                // Show selected tab
                if (tab === 'add') {
                    document.getElementById('add-post').classList.remove('hidden');
                    document.getElementById('add-tab').className = 'px-4 py-2 border-b-2 border-blue-500 text-blue-600 font-medium';
                } else if (tab === 'manage') {
                    document.getElementById('manage-posts').classList.remove('hidden');
                    document.getElementById('manage-tab').className = 'px-4 py-2 border-b-2 border-blue-500 text-blue-600 font-medium';
                    loadPosts();
                }
            }
            
            // Handle form submission
            document.getElementById('add-post-form').addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const formData = new FormData(e.target);
                const postData = {
                    title: formData.get('title'),
                    category: formData.get('category'),
                    excerpt: formData.get('excerpt') || '',
                    content: formData.get('content'),
                    featuredImage: formData.get('featuredImage') || '',
                    video: formData.get('videoUrl') ? {
                        url: formData.get('videoUrl'),
                        thumbnail: '',
                        duration: ''
                    } : undefined,
                    author: {
                        name: formData.get('authorName') || 'House31 Admin',
                        email: formData.get('authorEmail') || 'admin@house31.com'
                    },
                    tags: formData.get('tags') ? formData.get('tags').split(',').map(tag => tag.trim()).filter(tag => tag) : [],
                    isTrending: formData.get('isTrending') === 'on',
                    isHero: formData.get('isHero') === 'on',
                    status: 'published'
                };
                
                try {
                    const response = await fetch(API_BASE + '/posts', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Admin-Key': 'house31-admin-key-2024'
                        },
                        body: JSON.stringify(postData)
                    });
                    
                    const result = await response.json();
                    
                    if (response.ok) {
                        alert('Post created successfully!');
                        e.target.reset();
                    } else {
                        alert('Error creating post: ' + result.message);
                    }
                } catch (error) {
                    alert('Error creating post: ' + error.message);
                }
            });
            
            // Load and display posts
            async function loadPosts() {
                try {
                    const response = await fetch(API_BASE + '/posts?limit=20');
                    const result = await response.json();
                    
                    const postsContainer = document.getElementById('posts-list');
                    
                    if (result.posts && result.posts.length > 0) {
                        postsContainer.innerHTML = result.posts.map(post => \`
                            <div class="border border-gray-200 rounded-lg p-4">
                                <div class="flex justify-between items-start">
                                    <div class="flex-1">
                                        <h3 class="text-lg font-semibold text-gray-800">\${post.title}</h3>
                                        <p class="text-sm text-gray-600 mt-1">Category: \${post.category} | Status: \${post.status}</p>
                                        <p class="text-sm text-gray-500 mt-1">Created: \${new Date(post.createdAt).toLocaleDateString()}</p>
                                        \${post.excerpt ? \`<p class="text-gray-700 mt-2">\${post.excerpt}</p>\` : ''}
                                        <div class="flex items-center mt-2 space-x-2">
                                            \${post.isTrending ? '<span class="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">Trending</span>' : ''}
                                            \${post.isHero ? '<span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Hero</span>' : ''}
                                        </div>
                                    </div>
                                    <div class="flex space-x-2 ml-4">
                                        <button onclick="editPost('\${post._id}')" class="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                                        <button onclick="deletePost('\${post._id}', '\${post.title}')" class="text-red-600 hover:text-red-800 text-sm">Delete</button>
                                    </div>
                                </div>
                            </div>
                        \`).join('');
                    } else {
                        postsContainer.innerHTML = '<div class="text-center text-gray-500">No posts found</div>';
                    }
                } catch (error) {
                    document.getElementById('posts-list').innerHTML = '<div class="text-center text-red-500">Error loading posts: ' + error.message + '</div>';
                }
            }
            
            // Delete post
            async function deletePost(postId, title) {
                if (!confirm(\`Are you sure you want to delete "\${title}"?\`)) {
                    return;
                }
                
                try {
                    const response = await fetch(API_BASE + \`/posts/\${postId}\`, {
                        method: 'DELETE',
                        headers: {
                            'X-Admin-Key': 'house31-admin-key-2024'
                        }
                    });
                    
                    if (response.ok) {
                        alert('Post deleted successfully!');
                        loadPosts(); // Reload the list
                    } else {
                        const result = await response.json();
                        alert('Error deleting post: ' + result.message);
                    }
                } catch (error) {
                    alert('Error deleting post: ' + error.message);
                }
            }
            
            // Edit post (simplified - shows current values in form)
            async function editPost(postId) {
                try {
                    const response = await fetch(API_BASE + \`/posts\`);
                    const result = await response.json();
                    const post = result.posts.find(p => p._id === postId);
                    
                    if (post) {
                        // Switch to add tab and populate form
                        showTab('add');
                        const form = document.getElementById('add-post-form');
                        form.title.value = post.title;
                        form.category.value = post.category;
                        form.excerpt.value = post.excerpt || '';
                        form.content.value = post.content;
                        form.featuredImage.value = post.featuredImage || '';
                        form.videoUrl.value = post.video?.url || '';
                        form.authorName.value = post.author?.name || '';
                        form.authorEmail.value = post.author?.email || '';
                        form.tags.value = post.tags?.join(', ') || '';
                        form.isTrending.checked = post.isTrending;
                        form.isHero.checked = post.isHero;
                        
                        // Change form to update mode
                        form.setAttribute('data-edit-id', postId);
                        form.querySelector('button[type="submit"]').textContent = 'Update Post';
                    }
                } catch (error) {
                    alert('Error loading post: ' + error.message);
                }
            }
            
            // Update form submission handler to support editing
            document.getElementById('add-post-form').addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const editId = e.target.getAttribute('data-edit-id');
                const formData = new FormData(e.target);
                const postData = {
                    title: formData.get('title'),
                    category: formData.get('category'),
                    excerpt: formData.get('excerpt') || '',
                    content: formData.get('content'),
                    featuredImage: formData.get('featuredImage') || '',
                    video: formData.get('videoUrl') ? {
                        url: formData.get('videoUrl'),
                        thumbnail: '',
                        duration: ''
                    } : undefined,
                    author: {
                        name: formData.get('authorName') || 'House31 Admin',
                        email: formData.get('authorEmail') || 'admin@house31.com'
                    },
                    tags: formData.get('tags') ? formData.get('tags').split(',').map(tag => tag.trim()).filter(tag => tag) : [],
                    isTrending: formData.get('isTrending') === 'on',
                    isHero: formData.get('isHero') === 'on',
                    status: 'published'
                };
                
                try {
                    const url = editId ? \`\${API_BASE}/posts/\${editId}\` : \`\${API_BASE}/posts\`;
                    const method = editId ? 'PUT' : 'POST';
                    
                    const response = await fetch(url, {
                        method: method,
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Admin-Key': 'house31-admin-key-2024'
                        },
                        body: JSON.stringify(postData)
                    });
                    
                    const result = await response.json();
                    
                    if (response.ok) {
                        alert(editId ? 'Post updated successfully!' : 'Post created successfully!');
                        e.target.reset();
                        e.target.removeAttribute('data-edit-id');
                        e.target.querySelector('button[type="submit"]').textContent = 'Create Post';
                    } else {
                        alert(\`Error \${editId ? 'updating' : 'creating'} post: \` + result.message);
                    }
                } catch (error) {
                    alert(\`Error \${editId ? 'updating' : 'creating'} post: \` + error.message);
                }
            });
        </script>
    </body>
    </html>
  `);
});

module.exports = router;
