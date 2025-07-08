import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from '@iconify/react'
import { Button } from '@/components/ui/button'
import { api } from '@/services/api'
import type { Post } from '@/services/api'

interface SearchProps {
  onClose?: () => void
}

export default function Search({ onClose }: SearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true)
      try {
        const { posts } = await api.searchPosts(query, 1, 6)
        setResults(posts)
      } catch (error) {
        console.error('Search failed:', error)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query])

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        onClose?.()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
        onClose?.()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
      setIsOpen(false)
      onClose?.()
    }
  }

  const handleResultClick = (slug: string) => {
    navigate(`/post/${slug}`)
    setIsOpen(false)
    setQuery('')
    onClose?.()
  }

  const openSearch = () => {
    setIsOpen(true)
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  return (
    <div ref={searchRef} className="relative">
      {/* Search Button */}
      <Button 
        variant="outline" 
        size="sm" 
        onClick={openSearch}
        className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300 transition-colors"
      >
        <Icon icon="mdi:magnify" className="w-4 h-4" />
        <span className="hidden sm:inline">Search</span>
      </Button>

      {/* Search Modal/Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-start justify-center pt-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div 
              className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
            {/* Search Input */}
            <form onSubmit={handleSubmit} className="p-6 border-b">
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search articles, news, videos..."
                  className="w-full px-4 py-3 pl-12 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Icon 
                  icon="mdi:magnify"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                />
              </div>
            </form>

            {/* Search Results */}
            <div className="max-h-96 overflow-y-auto">
              {isLoading && (
                <div className="p-6 text-center">
                  <Icon icon="mdi:loading" className="animate-spin h-8 w-8 text-blue-600 mx-auto" />
                  <p className="mt-2 text-gray-600">Searching...</p>
                </div>
              )}

              {!isLoading && query && results.length === 0 && (
                <div className="p-6 text-center text-gray-500">
                  No results found for "{query}"
                </div>
              )}

              {!isLoading && results.length > 0 && (
                <div className="p-4">
                  <p className="text-sm text-gray-600 mb-4">
                    Found {results.length} result{results.length !== 1 ? 's' : ''}
                  </p>
                  <div className="space-y-3">
                    {results.map((post) => (
                      <button
                        key={post._id}
                        onClick={() => handleResultClick(post.slug)}
                        className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start space-x-3">
                          <img
                            src={post.featuredImage || `https://via.placeholder.com/80x60?text=${post.category}`}
                            alt={post.title}
                            className="w-16 h-12 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 line-clamp-1">
                              {post.title}
                            </h3>
                            <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                              {post.excerpt}
                            </p>
                            <div className="flex items-center mt-2 text-xs text-gray-500">
                              <span className="bg-gray-100 px-2 py-1 rounded">
                                {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
                              </span>
                              <span className="ml-2">
                                {new Date(post.publishedAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {results.length >= 6 && (
                    <div className="pt-4 border-t mt-4">
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => {
                          setIsOpen(false)
                          navigate(`/search?q=${encodeURIComponent(query)}`)
                        }}
                      >
                        View all results for "{query}"
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Close button */}
            <button
              onClick={() => {
                setIsOpen(false)
                onClose?.()
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Icon icon="mdi:close" className="w-6 h-6" />
            </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
