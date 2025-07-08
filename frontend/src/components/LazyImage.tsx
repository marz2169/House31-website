import { useLazyImage } from '@/hooks/useLazyImage'

// Lazy Image Component
interface LazyImageProps {
  src: string
  alt: string
  className?: string
  placeholder?: string
  onLoad?: () => void
  onError?: () => void
}

export function LazyImage({ 
  src, 
  alt, 
  className = "", 
  placeholder,
  onLoad,
  onError 
}: LazyImageProps) {
  const { 
    setImageRef, 
    imageSrc, 
    isLoaded, 
    error, 
    handleLoad, 
    handleError 
  } = useLazyImage(src)

  const handleImageLoad = () => {
    handleLoad()
    onLoad?.()
  }

  const handleImageError = () => {
    handleError()
    onError?.()
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Placeholder while loading */}
      {!isLoaded && !error && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          {placeholder ? (
            <img src={placeholder} alt="" className="w-full h-full object-cover opacity-50" />
          ) : (
            <div className="text-gray-400">Loading...</div>
          )}
        </div>
      )}
      
      {/* Error state */}
      {error && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-gray-400 text-center">
            <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
            <div className="text-sm">Failed to load image</div>
          </div>
        </div>
      )}
      
      {/* Actual image */}
      <img
        ref={setImageRef}
        src={imageSrc}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
    </div>
  )
}

export default LazyImage
