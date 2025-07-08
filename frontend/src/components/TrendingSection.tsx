import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { LazyImage } from './LazyImage'
import type { Post } from '@/services/api'
import { getAuthorName, getCategoryDisplayName } from '@/lib/helpers'

interface TrendingSectionProps {
  posts: Post[]
  showAsCarousel?: boolean
}

export default function TrendingSection({ posts, showAsCarousel = false }: TrendingSectionProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'carousel' | 'list'>(showAsCarousel ? 'carousel' : 'grid')

  if (!posts.length) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Trending Now</h2>
          <div className="text-center text-gray-500">
            <p>No trending posts available at the moment.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {/* Header with View Toggle */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-12">
          <h2 className="text-3xl font-bold mb-4 sm:mb-0">Trending Now</h2>
          
          {/* View Mode Toggle */}
          <div className="flex rounded-lg bg-gray-100 p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-md"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Grid
            </Button>
            <Button
              variant={viewMode === 'carousel' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('carousel')}
              className="rounded-md"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2 6a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM2 12a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2z" clipRule="evenodd" />
              </svg>
              Carousel
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-md"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
              </svg>
              List
            </Button>
          </div>
        </div>

        {/* Content based on view mode */}
        {viewMode === 'grid' ? (
          <GridView posts={posts} />
        ) : viewMode === 'carousel' ? (
          <CarouselView posts={posts} />
        ) : (
          <ListView posts={posts} />
        )}
      </div>
    </section>
  )
}

// Grid View Component
function GridView({ posts }: { posts: Post[] }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      {posts.map((post, index) => (
        <motion.div
          key={post._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <TrendingCard post={post} rank={index + 1} />
        </motion.div>
      ))}
    </motion.div>
  )
}

// Carousel View Component
function CarouselView({ posts }: { posts: Post[] }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {posts.map((post, index) => (
            <CarouselItem key={post._id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <TrendingCard post={post} rank={index + 1} />
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </motion.div>
  )
}

// List View Component
function ListView({ posts }: { posts: Post[] }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      {posts.map((post, index) => (
        <motion.div
          key={post._id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <TrendingListItem post={post} rank={index + 1} />
        </motion.div>
      ))}
    </motion.div>
  )
}

// Trending Card Component for Grid View
function TrendingCard({ post, rank }: { post: Post; rank: number }) {
  return (
    <Link to={`/post/${post.slug}`} className="block group">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="relative">
          <LazyImage 
            src={post.featuredImage || `https://via.placeholder.com/400x200?text=${post.category}`}
            alt={post.title}
            className="w-full h-48"
          />
          
          {/* Rank Badge */}
          <div className="absolute top-2 left-2">
            <div className="bg-red-600 text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center">
              {rank}
            </div>
          </div>
          
          {/* Category Badge */}
          <div className="absolute top-2 right-2">
            <span className="inline-block bg-black bg-opacity-75 text-white text-xs font-semibold px-2 py-1 rounded">
              {getCategoryDisplayName(post.category)}
            </span>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-bold mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {post.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
            {post.excerpt}
          </p>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>By {getAuthorName(post.author)}</span>
            <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

// Trending List Item Component for List View
function TrendingListItem({ post, rank }: { post: Post; rank: number }) {
  return (
    <Link to={`/post/${post.slug}`} className="block group">
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
        <div className="flex flex-col sm:flex-row">
          <div className="sm:w-64 flex-shrink-0 relative">
            <LazyImage 
              src={post.featuredImage || `https://via.placeholder.com/400x200?text=${post.category}`}
              alt={post.title}
              className="w-full h-48 sm:h-full"
            />
            
            {/* Rank Badge */}
            <div className="absolute top-2 left-2">
              <div className="bg-red-600 text-white text-lg font-bold rounded-full w-10 h-10 flex items-center justify-center">
                {rank}
              </div>
            </div>
          </div>
          
          <div className="flex-1 p-6">
            <div className="flex items-start justify-between mb-2">
              <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {getCategoryDisplayName(post.category)}
              </span>
            </div>
            
            <h3 className="text-xl font-bold mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
              {post.title}
            </h3>
            
            <p className="text-gray-600 mb-4 line-clamp-3">
              {post.excerpt}
            </p>
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>By {getAuthorName(post.author)}</span>
              <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
