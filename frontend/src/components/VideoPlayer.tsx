import { useState } from 'react'
import { Icon } from '@iconify/react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactPlayer from 'react-player'

interface VideoPlayerProps {
  url: string
  thumbnail?: string
  title: string
  onPlay?: () => void
  onPause?: () => void
  className?: string
}

export default function VideoPlayer({ 
  url, 
  thumbnail, 
  title, 
  onPlay, 
  onPause, 
  className = "" 
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasPlayed, setHasPlayed] = useState(false)

  const handlePlay = () => {
    setIsPlaying(true)
    setHasPlayed(true)
    onPlay?.()
  }

  const handlePause = () => {
    setIsPlaying(false)
    onPause?.()
  }

  const handleReady = () => {
    console.log('Video ready')
  }

  return (
    <motion.div 
      className={`relative bg-gray-900 rounded-lg overflow-hidden ${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative" style={{ aspectRatio: '16/9' }}>
        <ReactPlayer
          url={url}
          width="100%"
          height="100%"
          playing={isPlaying}
          controls={true}
          light={thumbnail || true}
          onPlay={handlePlay}
          onPause={handlePause}
          onReady={handleReady}
          onError={(error) => console.error('Video error:', error)}
          config={{
            youtube: {
              playerVars: {
                showinfo: 1,
                modestbranding: 1,
              },
            },
            vimeo: {
              playerOptions: {
                title: true,
                byline: true,
                portrait: false,
              },
            },
          }}
        />
        
        {/* Custom Play Button Overlay (when not played yet) */}
        <AnimatePresence>
          {!hasPlayed && (
            <motion.div 
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-20 transition-opacity cursor-pointer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handlePlay}
            >
              <motion.div 
                className="bg-white bg-opacity-90 rounded-full p-4 shadow-lg hover:bg-opacity-100 transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Icon 
                  icon="mdi:play" 
                  className="w-12 h-12 text-gray-800"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Video Title */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
        <h3 className="text-white font-semibold text-sm md:text-base line-clamp-2">
          {title}
        </h3>
      </div>
    </motion.div>
  )
}
