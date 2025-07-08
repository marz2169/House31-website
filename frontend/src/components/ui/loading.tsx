import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  message?: string
  variant?: 'spinner' | 'dots' | 'pulse'
}

export function LoadingSpinner({ 
  size = 'md', 
  message = 'Loading...', 
  variant = 'spinner' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }

  if (variant === 'spinner') {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className={`${sizeClasses[size]} text-blue-600`}
        >
          <Icon icon="mdi:loading" className="w-full h-full" />
        </motion.div>
        {message && (
          <motion.p 
            className={`text-gray-600 ${textSizes[size]}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {message}
          </motion.p>
        )}
      </div>
    )
  }

  if (variant === 'dots') {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="flex space-x-2">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-3 h-3 bg-blue-600 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: index * 0.2
              }}
            />
          ))}
        </div>
        {message && (
          <motion.p 
            className={`text-gray-600 ${textSizes[size]}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {message}
          </motion.p>
        )}
      </div>
    )
  }

  if (variant === 'pulse') {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <motion.div
          className={`${sizeClasses[size]} bg-blue-600 rounded-full`}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        {message && (
          <motion.p 
            className={`text-gray-600 ${textSizes[size]}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {message}
          </motion.p>
        )}
      </div>
    )
  }

  return null
}

export function PageLoader({ message = 'Loading content...' }: { message?: string }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <LoadingSpinner size="lg" message={message} variant="spinner" />
    </div>
  )
}

export function ContentLoader({ message = 'Loading...', className = '' }: { message?: string; className?: string }) {
  return (
    <div className={`flex items-center justify-center py-12 ${className}`}>
      <LoadingSpinner size="md" message={message} variant="dots" />
    </div>
  )
}
