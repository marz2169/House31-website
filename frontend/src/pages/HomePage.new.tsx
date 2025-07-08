import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { PageLoader } from '@/components/ui/loading'
import { LazyImage } from '@/components/LazyImage'
import { api, mockData } from '@/services/api'
import type { Post } from '@/services/api'

export default function HomePage() {
  const [heroArticle, setHeroArticle] = useState<Post | null>(null)
  const [trendingPosts, setTrendingPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Try to fetch from API, fallback to mock data
        const [hero, trending] = await Promise.all([
          api.getHeroArticle(),
          api.getTrendingPosts(10)
        ])

        setHeroArticle(hero || mockData.heroArticle)
        setTrendingPosts(trending.length > 0 ? trending : mockData.trendingPosts.slice(0, 6))
      } catch (error) {
        console.error('Failed to fetch homepage data:', error)
        // Use mock data as fallback
        setHeroArticle(mockData.heroArticle)
        setTrendingPosts(mockData.trendingPosts.slice(0, 6))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <PageLoader message="Loading homepage content..." />
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section - Large Feature Story */}
      <motion.section 
        className="relative bg-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Hero Article */}
            <motion.div 
              className="lg:col-span-2 relative"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative overflow-hidden rounded-lg bg-gray-900 aspect-[16/9] group cursor-pointer">
                <LazyImage 
                  src={heroArticle?.featuredImage || "https://via.placeholder.com/800x450"}
                  alt={heroArticle?.title || "Featured Article"}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold uppercase">
                      News
                    </span>
                    <span className="text-gray-300 text-sm">
                      a minute ago
                    </span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                    Warning issued to vapers puffing in public places after new law will land users with hefty fines
                  </h1>
                </div>
              </div>
            </motion.div>

            {/* Sidebar - Trending Stories */}
            <motion.div 
              className="lg:col-span-1 space-y-4"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-xl font-bold text-white mb-4">Latest Stories</h2>
              
              {/* Trending Article 1 */}
              <div className="bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition-colors cursor-pointer">
                <div className="flex space-x-4 p-4">
                  <div className="w-24 h-16 bg-gray-800 rounded overflow-hidden flex-shrink-0">
                    <LazyImage 
                      src="https://via.placeholder.com/96x64"
                      alt="News thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-red-500 text-xs font-semibold uppercase">News</span>
                      <span className="text-gray-400 text-xs">19 mins ago</span>
                    </div>
                    <h3 className="text-white font-semibold text-sm leading-tight">
                      Millions of drivers caught out each year by little-known UK driving law th...
                    </h3>
                  </div>
                </div>
              </div>

              {/* Trending Article 2 */}
              <div className="bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition-colors cursor-pointer">
                <div className="flex space-x-4 p-4">
                  <div className="w-24 h-16 bg-gray-800 rounded overflow-hidden flex-shrink-0">
                    <LazyImage 
                      src="https://via.placeholder.com/96x64"
                      alt="Entertainment thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-purple-500 text-xs font-semibold uppercase">Entertainment</span>
                      <span className="text-gray-400 text-xs">an hour ago</span>
                    </div>
                    <h3 className="text-white font-semibold text-sm leading-tight">
                      Body language expert reveals sweet gesture at first Oasis gig in 16 years...
                    </h3>
                  </div>
                </div>
              </div>

              {/* Trending Article 3 */}
              <div className="bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition-colors cursor-pointer">
                <div className="flex space-x-4 p-4">
                  <div className="w-24 h-16 bg-gray-800 rounded overflow-hidden flex-shrink-0">
                    <LazyImage 
                      src="https://via.placeholder.com/96x64"
                      alt="News thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-red-500 text-xs font-semibold uppercase">News</span>
                      <span className="text-gray-400 text-xs">17 hours ago</span>
                    </div>
                    <h3 className="text-white font-semibold text-sm leading-tight">
                      Girl, 9, dies after mum left her in the car whilst she went to work
                    </h3>
                  </div>
                </div>
              </div>

              {/* Trending Article 4 */}
              <div className="bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition-colors cursor-pointer">
                <div className="flex space-x-4 p-4">
                  <div className="w-24 h-16 bg-gray-800 rounded overflow-hidden flex-shrink-0">
                    <LazyImage 
                      src="https://via.placeholder.com/96x64"
                      alt="News thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-red-500 text-xs font-semibold uppercase">News</span>
                      <span className="text-gray-400 text-xs">17 hours ago</span>
                    </div>
                    <h3 className="text-white font-semibold text-sm leading-tight">
                      Incredible photo shows woman hanging on to tree before being rescued...
                    </h3>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Choose A Topic Section */}
      <motion.section 
        className="bg-black py-16"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-white text-center mb-12 uppercase tracking-wide">
            Choose A Topic:
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* News Category */}
            <Link to="/news" className="group">
              <div className="bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition-all duration-300 group-hover:scale-105">
                <div className="aspect-[4/3] bg-gradient-to-br from-red-600 to-red-800 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-bold text-white">News</h3>
                    <p className="text-gray-200 text-sm">Breaking news and current events</p>
                  </div>
                </div>
              </div>
            </Link>

            {/* Entertainment Category */}
            <Link to="/entertainment" className="group">
              <div className="bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition-all duration-300 group-hover:scale-105">
                <div className="aspect-[4/3] bg-gradient-to-br from-purple-600 to-purple-800 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-bold text-white">Entertainment</h3>
                    <p className="text-gray-200 text-sm">Movies, TV shows, celebrity news</p>
                  </div>
                </div>
              </div>
            </Link>

            {/* Videos Category */}
            <Link to="/videos" className="group">
              <div className="bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition-all duration-300 group-hover:scale-105">
                <div className="aspect-[4/3] bg-gradient-to-br from-blue-600 to-blue-800 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-bold text-white">Videos</h3>
                    <p className="text-gray-200 text-sm">Trending videos and viral content</p>
                  </div>
                </div>
              </div>
            </Link>

            {/* More Category */}
            <Link to="/news" className="group">
              <div className="bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition-all duration-300 group-hover:scale-105">
                <div className="aspect-[4/3] bg-gradient-to-br from-green-600 to-green-800 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-bold text-white">More</h3>
                    <p className="text-gray-200 text-sm">Explore all categories</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Trending Now Section */}
      <motion.section 
        className="bg-black py-16"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-white text-center mb-12 uppercase tracking-wide">
            Trending Now
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingPosts.map((post, index) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
                className="bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition-all duration-300 group cursor-pointer"
              >
                <div className="aspect-[16/9] bg-gray-800 relative overflow-hidden">
                  <LazyImage 
                    src={post.featuredImage || "https://via.placeholder.com/400x225"}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                      post.category === 'news' ? 'bg-red-600 text-white' :
                      post.category === 'entertainment' ? 'bg-purple-600 text-white' :
                      'bg-blue-600 text-white'
                    }`}>
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-white font-bold text-lg mb-2 line-clamp-2 group-hover:text-gray-300 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-sm">
                      {new Date(post.publishedAt).toLocaleDateString()}
                    </span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                    >
                      Read More
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  )
}
