"use client"

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

declare global {
  interface Window {
    gtag: (command: string, ...args: any[]) => void
    dataLayer: any[]
  }
}

interface AnalyticsConfig {
  trackingId: string
  debug?: boolean
}

class Analytics {
  private trackingId: string
  private debug: boolean
  private initialized: boolean = false

  constructor(config: AnalyticsConfig) {
    this.trackingId = config.trackingId
    this.debug = config.debug || false
  }

  // Initialize Google Analytics
  init() {
    if (this.initialized || !this.trackingId) return

    // Create dataLayer
    window.dataLayer = window.dataLayer || []
    window.gtag = function gtag() {
      window.dataLayer.push(arguments)
    }

    // Configure GA
    window.gtag('js', new Date())
    window.gtag('config', this.trackingId, {
      page_title: document.title,
      page_location: window.location.href,
      anonymize_ip: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    })

    // Load GA script
    const script = document.createElement('script')
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.trackingId}`
    script.async = true
    document.head.appendChild(script)

    this.initialized = true
    this.log('Analytics initialized')
  }

  // Track page views
  pageview(url: string, title?: string) {
    if (!this.initialized) return

    window.gtag('config', this.trackingId, {
      page_path: url,
      page_title: title || document.title,
    })

    this.log('Pageview tracked:', url)
  }

  // Track custom events
  event(action: string, parameters: Record<string, any> = {}) {
    if (!this.initialized) return

    window.gtag('event', action, {
      event_category: parameters.category || 'engagement',
      event_label: parameters.label,
      value: parameters.value,
      ...parameters
    })

    this.log('Event tracked:', action, parameters)
  }

  // Track custom events (alias for event method)
  trackEvent(action: string, parameters: Record<string, any> = {}) {
    return this.event(action, parameters)
  }

  // Track video interactions
  trackVideoClick(videoTitle: string, videoCategory: string, position: number) {
    this.event('video_click', {
      category: 'video_engagement',
      label: videoTitle,
      video_category: videoCategory,
      position: position,
      event_title: videoTitle
    })
  }

  // Track scroll depth
  trackScrollDepth(percentage: number) {
    this.event('scroll_depth', {
      category: 'page_engagement',
      label: `${percentage}%`,
      value: percentage
    })
  }

  // Track time on page
  trackTimeOnPage(seconds: number) {
    this.event('time_on_page', {
      category: 'page_engagement',
      value: seconds,
      label: `${Math.floor(seconds / 60)}min ${seconds % 60}s`
    })
  }

  // Track newsletter signup
  trackNewsletterSignup(source: string) {
    this.event('newsletter_signup', {
      category: 'conversion',
      label: source,
      value: 1
    })
  }

  // Track theme changes
  trackThemeChange(theme: string) {
    this.event('theme_change', {
      category: 'user_preference',
      label: theme
    })
  }

  // Track search
  trackSearch(searchTerm: string, results: number) {
    this.event('search', {
      search_term: searchTerm,
      category: 'site_search',
      value: results
    })
  }

  // Track exit intent
  trackExitIntent() {
    this.event('exit_intent', {
      category: 'user_behavior',
      label: 'popup_triggered'
    })
  }

  // Track ad interactions
  trackAdClick(adLocation: string) {
    this.event('ad_click', {
      category: 'advertising',
      label: adLocation,
      value: 1
    })
  }

  // Track CTA interactions
  trackCTAClick(ctaType: string, location: string) {
    this.event('cta_click', {
      category: 'conversion',
      label: `${ctaType}_${location}`,
      cta_type: ctaType
    })
  }

  private log(...args: any[]) {
    if (this.debug) {
      console.log('[Analytics]', ...args)
    }
  }
}

// Create analytics instance
export const analytics = new Analytics({
  trackingId: process.env.NEXT_PUBLIC_GA_TRACKING_ID || '',
  debug: process.env.NODE_ENV === 'development'
})

// React hook for tracking page views
export function useAnalytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Initialize analytics
    analytics.init()
  }, [])

  useEffect(() => {
    // Track page views on route changes
    if (pathname) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '')
      analytics.pageview(url)
    }
  }, [pathname, searchParams])

  return analytics
}

// Scroll depth tracking hook
export function useScrollTracking() {
  useEffect(() => {
    let maxScroll = 0
    const scrollMilestones = [25, 50, 75, 90, 100]
    const trackedMilestones = new Set<number>()

    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      )

      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent

        // Track milestones
        scrollMilestones.forEach(milestone => {
          if (scrollPercent >= milestone && !trackedMilestones.has(milestone)) {
            trackedMilestones.add(milestone)
            analytics.trackScrollDepth(milestone)
          }
        })
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
}

// Time on page tracking hook
export function useTimeTracking() {
  useEffect(() => {
    const startTime = Date.now()
    const milestones = [30, 60, 120, 300] // 30s, 1min, 2min, 5min
    const trackedMilestones = new Set<number>()

    const interval = setInterval(() => {
      const timeOnPage = Math.floor((Date.now() - startTime) / 1000)
      
      milestones.forEach(milestone => {
        if (timeOnPage >= milestone && !trackedMilestones.has(milestone)) {
          trackedMilestones.add(milestone)
          analytics.trackTimeOnPage(milestone)
        }
      })
    }, 10000) // Check every 10 seconds

    return () => {
      clearInterval(interval)
      // Track final time on page
      const finalTime = Math.floor((Date.now() - startTime) / 1000)
      if (finalTime > 10) { // Only track if user stayed more than 10 seconds
        analytics.trackTimeOnPage(finalTime)
      }
    }
  }, [])
}

export default Analytics
