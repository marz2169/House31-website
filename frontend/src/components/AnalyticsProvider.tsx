import { createContext, useContext, useEffect } from 'react'
import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import analytics from '@/lib/analytics'

interface AnalyticsContextType {
  trackEvent: (action: string, parameters?: Record<string, any>) => void
  trackVideoClick: (title: string, category: string, position: number) => void
  trackNewsletterSignup: (location: string) => void
  trackSearch: (query: string, results: number) => void
  trackExitIntent: () => void
  trackAdInteraction: (adType: string, action: string) => void
}

const AnalyticsContext = createContext<AnalyticsContextType>({
  trackEvent: () => {},
  trackVideoClick: () => {},
  trackNewsletterSignup: () => {},
  trackSearch: () => {},
  trackExitIntent: () => {},
  trackAdInteraction: () => {},
})

interface AnalyticsProviderProps {
  children: ReactNode
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const location = useLocation()

  useEffect(() => {
    // Initialize analytics
    analytics.init()
  }, [])

  useEffect(() => {
    // Track page views on route changes
    analytics.pageview(location.pathname + location.search)
  }, [location])

  useEffect(() => {
    // Track scroll depth
    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      )
      analytics.trackScrollDepth(scrollPercent)
    }

    // Track time on page
    const timeInterval = setInterval(() => {
      analytics.trackTimeOnPage()
    }, 30000) // Check every 30 seconds

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearInterval(timeInterval)
    }
  }, [])

  const contextValue: AnalyticsContextType = {
    trackEvent: analytics.event.bind(analytics),
    trackVideoClick: analytics.trackVideoClick.bind(analytics),
    trackNewsletterSignup: analytics.trackNewsletterSignup.bind(analytics),
    trackSearch: analytics.trackSearch.bind(analytics),
    trackExitIntent: analytics.trackExitIntent.bind(analytics),
    trackAdInteraction: analytics.trackAdInteraction.bind(analytics),
  }

  return (
    <AnalyticsContext.Provider value={contextValue}>
      {children}
    </AnalyticsContext.Provider>
  )
}

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext)
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider')
  }
  return context
}
