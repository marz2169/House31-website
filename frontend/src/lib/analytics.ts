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
  private scrollThresholds: Set<number> = new Set()
  private startTime: number = Date.now()

  constructor(config: AnalyticsConfig) {
    this.trackingId = config.trackingId
    this.debug = config.debug || false
  }

  // Initialize Google Analytics
  init() {
    if (this.initialized || !this.trackingId || typeof window === 'undefined') return

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
    this.startTime = Date.now()
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
    // Only track major milestones
    const threshold = Math.floor(percentage / 25) * 25
    if (threshold > 0 && !this.scrollThresholds.has(threshold)) {
      this.scrollThresholds.add(threshold)
      this.event('scroll_depth', {
        category: 'page_engagement',
        label: `${threshold}%`,
        value: threshold
      })
    }
  }

  // Track time on page
  trackTimeOnPage() {
    const timeSpent = Math.floor((Date.now() - this.startTime) / 1000)
    
    // Track time milestones
    if (timeSpent === 30 || timeSpent === 60 || timeSpent === 120 || timeSpent === 300) {
      this.event('time_on_page', {
        category: 'page_engagement',
        label: `${timeSpent}s`,
        value: timeSpent
      })
    }
  }

  // Track newsletter signup
  trackNewsletterSignup(location: string) {
    this.event('newsletter_signup', {
      category: 'conversion',
      label: location,
      value: 1
    })
  }

  // Track search
  trackSearch(query: string, results: number) {
    this.event('search', {
      category: 'engagement',
      label: query,
      search_term: query,
      value: results
    })
  }

  // Track exit intent
  trackExitIntent() {
    this.event('exit_intent', {
      category: 'user_behavior',
      label: 'popup_shown'
    })
  }

  // Track ad interactions
  trackAdInteraction(adType: string, action: string) {
    this.event('ad_interaction', {
      category: 'advertising',
      label: `${adType}_${action}`,
      ad_type: adType,
      action: action
    })
  }

  private log(...args: any[]) {
    if (this.debug) {
      console.log('[Analytics]', ...args)
    }
  }
}

// Export singleton instance
export const analytics = new Analytics({
  trackingId: import.meta.env.VITE_GA_TRACKING_ID || '',
  debug: import.meta.env.MODE === 'development'
})

// React hooks for analytics
export const usePageTracking = () => {
  const trackPageView = (path: string, title?: string) => {
    analytics.pageview(path, title)
  }

  return { trackPageView }
}

export const useScrollTracking = () => {
  const trackScroll = () => {
    const scrollPercent = Math.round(
      (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
    )
    analytics.trackScrollDepth(scrollPercent)
  }

  return { trackScroll }
}

export const useTimeTracking = () => {
  const trackTime = () => {
    analytics.trackTimeOnPage()
  }

  return { trackTime }
}

export default analytics
