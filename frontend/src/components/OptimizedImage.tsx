import { useState, useRef, useEffect, useCallback } from 'react'
import { replacePlaceholderUrl } from '../lib/placeholders'

interface OptimizedImageProps {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
  loading?: 'lazy' | 'eager'
  onLoad?: () => void
  onError?: () => void
}

export default function OptimizedImage({
  src,
  alt,
  className = '',
  width,
  height,
  loading = 'lazy',
  onLoad,
  onError
}: OptimizedImageProps) {
  const [imageSrc, setImageSrc] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  // Check if WebP is supported
  const supportsWebP = () => {
    const canvas = document.createElement('canvas')
    canvas.width = 1
    canvas.height = 1
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
  }

  // Generate WebP version of URL if it's a placeholder or can be converted
  const getOptimizedSrc = useCallback((originalSrc: string): string => {
    // Replace external placeholder URLs with local data URIs
    const processedSrc = replacePlaceholderUrl(originalSrc)
    
    // If it was replaced with a data URI, return it directly
    if (processedSrc.startsWith('data:')) {
      return processedSrc
    }
    
    // For placeholder images, we can request WebP format
    if (originalSrc.includes('placeholder.com') || originalSrc.includes('via.placeholder.com')) {
      return originalSrc + '&format=webp'
    }
    
    // For other images, we would typically have WebP versions on the server
    // This is a simplified example - in production you'd have proper WebP conversion
    if (supportsWebP() && !originalSrc.includes('.webp')) {
      // In a real app, you'd check if a WebP version exists on your server
      // For now, we'll use the original src
      return originalSrc
    }
    
    return originalSrc
  }, [])

  useEffect(() => {
    if (!src) return

    const optimizedSrc = getOptimizedSrc(src)
    setImageSrc(optimizedSrc)
  }, [src, getOptimizedSrc])

  const handleImageLoad = () => {
    setIsLoading(false)
    onLoad?.()
  }

  const handleImageError = () => {
    setHasError(true)
    setIsLoading(false)
    
    // Fallback to original src if WebP fails
    if (imageSrc !== src) {
      setImageSrc(src)
      setHasError(false)
      return
    }
    
    onError?.()
  }

  if (hasError) {
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center text-gray-500 text-sm ${className}`}
        style={{ width, height }}
      >
        Failed to load image
      </div>
    )
  }

  return (
    <div className="relative">
      {isLoading && (
        <div 
          className={`absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center ${className}`}
          style={{ width, height }}
        >
          <svg 
            className="w-8 h-8 text-gray-400" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path 
              fillRule="evenodd" 
              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" 
              clipRule="evenodd" 
            />
          </svg>
        </div>
      )}
      <img
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        className={className}
        width={width}
        height={height}
        loading={loading}
        onLoad={handleImageLoad}
        onError={handleImageError}
        style={{ 
          display: isLoading ? 'none' : 'block',
          width,
          height
        }}
      />
    </div>
  )
}
