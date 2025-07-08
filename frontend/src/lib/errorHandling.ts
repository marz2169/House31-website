// Network error types
export interface NetworkError extends Error {
  status?: number
  statusText?: string
  url?: string
}

// Error notification utility
export class ErrorNotification {
  static show(message: string, type: 'error' | 'warning' | 'info' = 'error') {
    // For now, use console, but this could be extended to use a toast library
    console[type === 'error' ? 'error' : type === 'warning' ? 'warn' : 'info'](`[${type.toUpperCase()}] ${message}`)
    
    // In a real app, you might use a toast notification library here
    // Example: toast.error(message)
  }
}

// Enhanced fetch with better error handling
export async function fetchWithErrorHandling<T>(
  url: string, 
  options?: RequestInit,
  context?: string
): Promise<T> {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const error: NetworkError = new Error(`HTTP Error: ${response.status} ${response.statusText}`)
      error.status = response.status
      error.statusText = response.statusText
      error.url = url
      
      // Handle specific HTTP errors
      switch (response.status) {
        case 404:
          ErrorNotification.show('The requested content was not found.', 'warning')
          break
        case 500:
          ErrorNotification.show('Server error. Please try again later.', 'error')
          break
        case 503:
          ErrorNotification.show('Service temporarily unavailable. Please try again later.', 'warning')
          break
        default:
          ErrorNotification.show(`Request failed: ${response.statusText}`, 'error')
      }
      
      throw error
    }

    const data = await response.json()
    return data
  } catch (error) {
    const networkError = error as NetworkError
    
    // Handle network errors
    if (networkError.name === 'TypeError' && networkError.message.includes('fetch')) {
      ErrorNotification.show('Network connection failed. Please check your internet connection.', 'error')
    }
    
    // Report error for tracking (in development)
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', networkError, `Context: ${context || `API request to ${url}`}`)
    }
    
    throw networkError
  }
}

// Retry mechanism for failed requests
export async function retryRequest<T>(
  requestFn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn()
    } catch (error) {
      lastError = error as Error
      
      if (attempt === maxRetries) {
        break
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * attempt))
    }
  }
  
  throw lastError!
}

// Offline detection
export function useOfflineDetection() {
  const isOnline = navigator.onLine
  
  if (!isOnline) {
    ErrorNotification.show('You appear to be offline. Some features may not work.', 'warning')
  }
  
  return { isOnline }
}

export default {
  fetchWithErrorHandling,
  retryRequest,
  useOfflineDetection,
  ErrorNotification
}
