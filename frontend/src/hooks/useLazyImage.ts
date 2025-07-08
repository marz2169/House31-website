import { useState, useEffect } from 'react'

// Hook for lazy loading images
export const useLazyImage = (src: string) => {
  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined)
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    let observer: IntersectionObserver
    
    if (imageRef && src) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setImageSrc(src)
            observer.disconnect()
          }
        },
        { threshold: 0.1, rootMargin: '50px' }
      )
      
      observer.observe(imageRef)
    }

    return () => {
      if (observer) observer.disconnect()
    }
  }, [imageRef, src])

  const handleLoad = () => setIsLoaded(true)
  const handleError = () => setError(true)

  return {
    setImageRef,
    imageSrc,
    isLoaded,
    error,
    handleLoad,
    handleError,
  }
}
