import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { api } from '@/services/api'
import type { Post } from '@/services/api'
import { getAuthorName } from '@/lib/helpers'
import SEO from '@/components/SEO'
import LazyLoad from '@/components/LazyLoad'

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const category = searchParams.get('category') || ''
  
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  })

  const fetchSearchResults = useCallback(async (page = 1) => {
    if (!query.trim()) return

    try {
      setLoading(true)
      const response = await api.searchPosts(query, page, pagination.limit)
      setPosts(response.posts)
      setPagination(response.pagination)
    } catch (error) {
      console.error('Failed to fetch search results:', error)
      setPosts([])
    } finally {
      setLoading(false)
    }
  }, [query, pagination.limit])

  useEffect(() => {
    fetchSearchResults()
  }, [fetchSearchResults])

  const handlePageChange = (newPage: number) => {
    if (newPage !== pagination.page && newPage >= 1 && newPage <= pagination.pages) {
      fetchSearchResults(newPage)
    }
  }

  if (loading) {
    return (
      <>
        <SEO 
          title={`Search Results for "${query}" | House31`}
          description={`Search results for "${query}" on House31`}
          type="website"
        />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Searching for "{query}"...</p>
          </div>
        </div>
      </>
    )
  }

  if (!query.trim()) {
    return (
      <>
        <SEO 
          title="Search | House31"
          description="Search for articles, news, and videos on House31"
          type="website"
        />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4" style={{ fontSize: '1.875rem', margin: '0 0 1rem 0' }}>Search House31</h1>
            <p className="text-gray-600 mb-6">Enter a search term to find articles, news, and videos</p>
            <Link to="/">
              <Button>Go Home</Button>
            </Link>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <SEO 
        title={`Search Results for "${query}" | House31`}
        description={`Search results for "${query}" on House31 - Found ${pagination.total} results`}
        type="website"
      />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Search Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4" style={{ fontSize: '2.25rem', margin: '0 0 1rem 0' }}>
              Search Results
            </h1>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-xl text-gray-700">
                  Results for: <span className="font-semibold">"{query}"</span>
                </p>
                <p className="text-gray-600">
                  {pagination.total} result{pagination.total !== 1 ? 's' : ''} found
                </p>
              </div>
              
              {/* Category Filter */}
              <div className="flex gap-2">
                <Link 
                  to={`/search?q=${encodeURIComponent(query)}`}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    !category 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  All
                </Link>
                {['news', 'entertainment', 'videos'].map((cat) => (
                  <Link
                    key={cat}
                    to={`/search?q=${encodeURIComponent(query)}&category=${cat}`}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      category === cat
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Search Results */}
          {posts.length === 0 ? (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">No results found</h2>
                <p className="text-gray-600 mb-6">
                  Sorry, we couldn't find any articles matching "{query}".
                </p>
                <div className="space-y-2 text-sm text-gray-500">
                  <p>Try:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Checking your spelling</li>
                    <li>Using different keywords</li>
                    <li>Using more general terms</li>
                    <li>Browsing our categories instead</li>
                  </ul>
                </div>
                <div className="mt-6 flex flex-wrap gap-2 justify-center">
                  <Link to="/news">
                    <Button variant="outline" size="sm">Browse News</Button>
                  </Link>
                  <Link to="/entertainment">
                    <Button variant="outline" size="sm">Browse Entertainment</Button>
                  </Link>
                  <Link to="/videos">
                    <Button variant="outline" size="sm">Browse Videos</Button>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Results Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {posts.map((post) => (
                  <Link key={post._id} to={`/post/${post.slug}`} className="block">
                    <article className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                      <LazyLoad height={192}>
                        <img 
                          src={post.featuredImage || `https://via.placeholder.com/400x200?text=${post.category}`}
                          alt={post.title}
                          className="w-full h-48 object-cover"
                        />
                      </LazyLoad>
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                            post.category === 'news' ? 'bg-red-100 text-red-800' :
                            post.category === 'entertainment' ? 'bg-purple-100 text-purple-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
                          </span>
                          {post.videoUrl && (
                            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                              📺 Video
                            </span>
                          )}
                        </div>
                        <h2 className="text-xl font-bold mb-2 line-clamp-2">{post.title}</h2>
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>
                        <div className="flex justify-between items-center text-sm text-gray-500">
                          <span>By {getAuthorName(post.author)}</span>
                          <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex justify-center items-center space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                  >
                    Previous
                  </Button>
                  
                  <div className="flex space-x-1">
                    {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                      const page = i + 1
                      return (
                        <Button
                          key={page}
                          variant={pagination.page === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </Button>
                      )
                    })}
                  </div>
                  
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}
