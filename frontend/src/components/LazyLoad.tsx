import { useState, useRef, useEffect } from 'react'
import type { ReactNode } from 'react'

interface LazyLoadProps {
  children: ReactNode
  height?: string | number
  offset?: number
  placeholder?: ReactNode
  className?: string
  onLoad?: () => void
}

function LazyLoad({ 
  children, 
  height = 200, 
  offset = 100, 
  placeholder, 
  className = "",
  onLoad 
}: LazyLoadProps) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true)
          onLoad?.()
          observer.disconnect()
        }
      },
      {
        threshold: 0.1,
        rootMargin: `${offset}px`,
      }
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => observer.disconnect()
  }, [offset, onLoad])

  const defaultPlaceholder = (
    <div 
      className="bg-gray-200 animate-pulse flex items-center justify-center"
      style={{ height: typeof height === 'number' ? `${height}px` : height }}
    >
      <div className="text-gray-400">Loading...</div>
    </div>
  )

  return (
    <div ref={elementRef} className={className}>
      {isIntersecting ? children : (placeholder || defaultPlaceholder)}
    </div>
  )
}

LazyLoad.displayName = 'LazyLoad'

export default LazyLoad