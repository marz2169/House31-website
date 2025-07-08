import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import VideoCard from '@/components/VideoCard'
import { api } from '@/services/api'
import type { Post } from '@/services/api'
import SEO from '@/components/SEO'
import { generateMockPosts } from '@/lib/placeholders'

export default function VideosPage() {
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
      const response = await api.getPostsByCategory('videos', page, pagination.limit)
      
      if (response.posts.length === 0) {
        // Generate diverse mock data for videos category
        const mockPosts = generateMockPosts('videos', 9)
        
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
      console.error('Failed to fetch video posts:', error)
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading videos...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <SEO 
        title="Videos | House31"
        description="Watch trending videos and exclusive content from our video collection"
        type="website"
      />
      <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4" style={{ fontSize: '2.25rem', margin: '0 0 1rem 0' }}>Videos</h1>
          <p className="text-gray-600 mb-4">Watch trending videos and exclusive content</p>
          
          {/* Filter/Sort Options */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Sort by:</span>
              <select className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="popular">Most Popular</option>
                <option value="duration">Duration</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">View:</span>
              <Button size="sm" variant="outline">Grid</Button>
              <Button size="sm" variant="ghost">List</Button>
            </div>
          </div>
        </div>
        
        {/* Videos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
          {posts.map((post) => (
            <VideoCard 
              key={`video-${post._id}`}
              video={post}
              onPlayClick={() => console.log('Playing video:', post.title)}
            />
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

        {/* Video Stats */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Video Collection Stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{posts.length}</div>
              <div className="text-sm text-gray-600">Total Videos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">4.8K</div>
              <div className="text-sm text-gray-600">Total Views</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">2.5h</div>
              <div className="text-sm text-gray-600">Watch Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">Weekly</div>
              <div className="text-sm text-gray-600">New Content</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
