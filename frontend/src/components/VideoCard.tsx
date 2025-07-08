import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import VideoPlayer from './VideoPlayer'
import { LazyImage } from './LazyImage'
import type { Post } from '@/services/api'

interface VideoCardProps {
  video: Post
  showPlayer?: boolean
  onPlayClick?: () => void
}

export default function VideoCard({ video, showPlayer = false, onPlayClick }: VideoCardProps) {
  const [isPlayerVisible, setIsPlayerVisible] = useState(showPlayer)

  const handlePlayClick = () => {
    setIsPlayerVisible(true)
    onPlayClick?.()
  }

  const formatDuration = (seconds: number = 342) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatViews = (views: number = Math.floor(Math.random() * 100000)) => {
    if (views > 1000000) {
      return `${(views / 1000000).toFixed(1)}M views`
    } else if (views > 1000) {
      return `${(views / 1000).toFixed(1)}K views`
    }
    return `${views} views`
  }

  if (isPlayerVisible && video.videoUrl) {
    return (
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <VideoPlayer
          url={video.videoUrl}
          thumbnail={video.featuredImage}
          title={video.title}
          className="w-full"
        />
        <div className="p-4">
          <div className="flex items-center justify-between">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setIsPlayerVisible(false)}
            >
              Back to Thumbnail
            </Button>
            <Link to={`/post/${video.slug}`}>
              <Button size="sm">View Details</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div 
      className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className="relative group cursor-pointer" 
        onClick={handlePlayClick}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <LazyImage 
          src={video.featuredImage || `https://via.placeholder.com/400x225?text=Video`}
          alt={video.title}
          className="w-full h-48 group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300">
          <div className="bg-white bg-opacity-90 rounded-full p-3 group-hover:scale-110 transition-transform duration-300">
            <svg className="w-6 h-6 text-gray-800" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 5v10l7-5z" />
            </svg>
          </div>
        </div>
        
        {/* Duration Badge */}
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
          {formatDuration()}
        </div>
        
        {/* Category Badge */}
        <div className="absolute top-2 left-2">
          <span className="inline-block bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">
            {video.category === 'videos' ? 'Video' : video.category.charAt(0).toUpperCase() + video.category.slice(1)}
          </span>
        </div>
      </motion.div>
      
      <div className="p-4">
        <h3 className="font-bold mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
          {video.title}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {video.excerpt}
        </p>
        
        {/* Video Meta Information */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span>{formatViews()}</span>
          <span>{new Date(video.publishedAt).toLocaleDateString()}</span>
        </div>
        
        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button size="sm" onClick={handlePlayClick} className="flex-1">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 5v10l7-5z" />
            </svg>
            Play
          </Button>
          <Link to={`/post/${video.slug}`} className="flex-1">
            <Button size="sm" variant="outline" className="w-full">
              Details
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
