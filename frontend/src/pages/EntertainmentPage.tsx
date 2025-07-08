import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { api } from '@/services/api'
import type { Post } from '@/services/api'
import SEO from '@/components/SEO'
import LazyLoad from '@/components/LazyLoad'
import { generateMockPosts, getCategoryPlaceholder } from '@/lib/placeholders'

export default function EntertainmentPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  })

  const fetchPosts = useCallback(async (page = 1) => {
    try {
      setLoading(true)
      const response = await api.getPostsByCategory('entertainment', page, pagination.limit)
      
      if (response.posts.length === 0) {
        // Generate diverse mock data for entertainment category
        const mockPosts = generateMockPosts('entertainment', 9)
        
        setPosts(mockPosts)
        setPagination({
          page: 1,
          limit: 12,
          total: mockPosts.length,
          pages: 1,
        })
      } else {
        setPosts(response.posts)
        setPagination(response.pagination)
      }
    } catch (error) {
      console.error('Failed to fetch entertainment posts:', error)
    } finally {
      setLoading(false)
    }
  }, [pagination.limit])

  useEffect(() => {
    fetchPosts(1)
  }, [fetchPosts])

  const handlePageChange = (newPage: number) => {
    if (newPage !== pagination.page && newPage >= 1 && newPage <= pagination.pages) {
      fetchPosts(newPage)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading entertainment...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <SEO 
        title="Entertainment | House31"
        description="Discover the latest in movies, TV shows, and celebrity news in our entertainment section"
        type="website"
      />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4" style={{ fontSize: '2.25rem', margin: '0 0 1rem 0' }}>Entertainment</h1>
          <p className="text-gray-600">Discover the latest in movies, TV shows, and celebrity news</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {posts.map((post) => (
            <Link key={`entertainment-${post._id}`} to={`/post/${post.slug}`} className="block">
              <article className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow h-full flex flex-col">
                <LazyLoad height={192}>
                  <img 
                    src={post.featuredImage || getCategoryPlaceholder('entertainment', 400, 200)}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                </LazyLoad>
                <div className="p-6 flex-1 flex flex-col">
                  <span className="inline-block bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded-full mb-2 w-fit">
                    Entertainment
                  </span>
                  <h2 className="text-xl font-bold mb-2 line-clamp-2 flex-shrink-0">{post.title}</h2>
                  <p className="text-gray-600 mb-4 line-clamp-3 flex-1">
                    {post.excerpt}
                  </p>
                  <div className="flex justify-between items-center mt-auto">
                    <span className="text-sm text-gray-500">
                      {new Date(post.publishedAt).toLocaleDateString()}
                    </span>
                    <Button size="sm">Read More</Button>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center mt-12">
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                Previous
              </Button>
              
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  size="sm"
                  variant={page === pagination.page ? "default" : "outline"}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Button>
              ))}
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  )
}
