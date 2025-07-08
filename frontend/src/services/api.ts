// API configuration and utility functions
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

// Post interface
export interface Post {
  _id: string
  title: string
  content: string
  excerpt: string
  category: 'news' | 'entertainment' | 'videos'
  slug: string
  featuredImage?: string
  videoUrl?: string
  author?: string | { name: string; email?: string }
  publishedAt: string
  createdAt: string
  updatedAt: string
  tags?: string[]
  isHero?: boolean
  isTrending?: boolean
}

// API response interfaces
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: {
    posts: T[]
    pagination: {
      page: number
      limit: number
      total: number
      pages: number
    }
  }
}

// Generic API request function
async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('API request failed:', error)
    throw error
  }
}

// API functions
export const api = {
  // Get hero article (featured post)
  getHeroArticle: async (): Promise<Post | null> => {
    try {
      const response = await apiRequest<ApiResponse<Post>>('/posts/hero')
      return response.data
    } catch (error) {
      console.error('Failed to fetch hero article:', error)
      return null
    }
  },

  // Get trending posts
  getTrendingPosts: async (limit = 10): Promise<Post[]> => {
    try {
      const response = await apiRequest<ApiResponse<Post[]>>(`/posts/trending?limit=${limit}`)
      return response.data
    } catch (error) {
      console.error('Failed to fetch trending posts:', error)
      return []
    }
  },

  // Get posts by category with pagination
  getPostsByCategory: async (
    category: string,
    page = 1,
    limit = 12
  ): Promise<{ posts: Post[]; pagination: { page: number; limit: number; total: number; pages: number } }> => {
    try {
      const response = await apiRequest<PaginatedResponse<Post>>(
        `/posts/category/${category}?page=${page}&limit=${limit}`
      )
      return response.data
    } catch (error) {
      console.error('Failed to fetch posts by category:', error)
      return { posts: [], pagination: { page: 1, limit, total: 0, pages: 0 } }
    }
  },

  // Get single post by slug
  getPostBySlug: async (slug: string): Promise<Post | null> => {
    try {
      const response = await apiRequest<ApiResponse<Post>>(`/posts/${slug}`)
      return response.data
    } catch (error) {
      console.error('Failed to fetch post:', error)
      return null
    }
  },

  // Get all posts with pagination
  getAllPosts: async (page = 1, limit = 12): Promise<{ posts: Post[]; pagination: { page: number; limit: number; total: number; pages: number } }> => {
    try {
      const response = await apiRequest<PaginatedResponse<Post>>(
        `/posts?page=${page}&limit=${limit}`
      )
      return response.data
    } catch (error) {
      console.error('Failed to fetch posts:', error)
      return { posts: [], pagination: { page: 1, limit, total: 0, pages: 0 } }
    }
  },

  // Search posts
  searchPosts: async (query: string, page = 1, limit = 12): Promise<{ posts: Post[]; pagination: { page: number; limit: number; total: number; pages: number } }> => {
    try {
      const response = await apiRequest<PaginatedResponse<Post>>(
        `/posts/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
      )
      return response.data
    } catch (error) {
      console.error('Failed to search posts:', error)
      return { posts: [], pagination: { page: 1, limit, total: 0, pages: 0 } }
    }
  },
}

// Mock data for development when API is not available
export const mockData = {
  heroArticle: {
    _id: '1',
    title: 'Breaking: Major Development in Technology Sector',
    content: 'Full article content here...',
    excerpt: 'This is a major breakthrough that will change the industry forever...',
    category: 'news' as const,
    slug: 'breaking-major-development-technology-sector',
    featuredImage: 'https://via.placeholder.com/800x400?text=Hero+Article',
    author: 'John Doe',
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['technology', 'breaking', 'industry'],
    isHero: true,
  },

  trendingPosts: Array.from({ length: 10 }, (_, i) => {
    const categories: ('news' | 'entertainment' | 'videos')[] = ['news', 'entertainment', 'videos']
    const titles = [
      'Breaking: Major Technology Breakthrough Changes Everything',
      'Entertainment Industry Shaken by Surprise Announcement',
      'Viral Video Takes Social Media by Storm',
      'Political Development Impacts Global Markets',
      'Celebrity Couple Announces Engagement After Secret Romance',
      'New Scientific Discovery Could Revolutionize Medicine',
      'Streaming Wars Heat Up with Latest Platform Launch',
      'Economic Report Shows Unexpected Growth Patterns',
      'Hollywood Blockbuster Breaks Box Office Records',
      'Tech Giant Unveils Revolutionary Product Line'
    ]
    return {
      _id: `trending-${i + 1}`,
      title: titles[i] || `Trending Story ${i + 1}: Important News Update`,
      content: 'Article content...',
      excerpt: `This is trending story number ${i + 1} with important updates and breaking developments...`,
      category: categories[i % 3],
      slug: `trending-story-${i + 1}`,
      featuredImage: `https://via.placeholder.com/400x200?text=Trending+${i + 1}`,
      author: i % 2 === 0 ? 'Jane Smith' : 'John Doe',
      publishedAt: new Date(Date.now() - i * 3600000).toISOString(),
      createdAt: new Date(Date.now() - i * 3600000).toISOString(),
      updatedAt: new Date(Date.now() - i * 3600000).toISOString(),
      tags: ['trending', 'news', 'breaking'],
      isTrending: true,
    }
  }),
}
