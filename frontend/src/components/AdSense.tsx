import { useEffect, useState } from 'react'
import { useAnalytics } from './AnalyticsProvider'

interface AdSenseProps {
  adSlot: string
  adFormat?: 'auto' | 'rectangle' | 'banner' | 'leaderboard'
  className?: string
  fallbackCTA?: boolean
}

export function AdSense({ 
  adSlot, 
  adFormat = 'auto', 
  className = '', 
  fallbackCTA = true 
}: AdSenseProps) {
  const [adError, setAdError] = useState(false)
  const { trackAdInteraction } = useAnalytics()

  useEffect(() => {
    if (!import.meta.env.VITE_ADSENSE_CLIENT_ID) return

    try {
      // Load AdSense script if not already loaded
      if (!window.adsbygoogle) {
        const script = document.createElement('script')
        script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'
        script.async = true
        script.crossOrigin = 'anonymous'
        document.head.appendChild(script)
      }

      // Push ad to queue
      const timer = setTimeout(() => {
        try {
          ;(window.adsbygoogle = window.adsbygoogle || []).push({})
          trackAdInteraction(adFormat, 'loaded')
        } catch (error) {
          console.error('AdSense error:', error)
          setAdError(true)
          trackAdInteraction(adFormat, 'error')
        }
      }, 100)

      return () => clearTimeout(timer)
    } catch (error) {
      console.error('AdSense initialization error:', error)
      setAdError(true)
    }
  }, [adSlot, adFormat, trackAdInteraction])

  // Show fallback CTA if ad fails to load
  if (adError && fallbackCTA) {
    return (
      <div className={`${className} p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-center`}>
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
          Stay Updated with House31
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Get the latest news and entertainment content delivered to your inbox
        </p>
        <button 
          className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          onClick={() => trackAdInteraction('fallback-cta', 'clicked')}
        >
          Subscribe Now
        </button>
      </div>
    )
  }

  if (!import.meta.env.VITE_ADSENSE_CLIENT_ID) {
    return null
  }

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={import.meta.env.VITE_ADSENSE_CLIENT_ID}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
    </div>
  )
}

// Auto Ads component for head insertion
export function AdSenseAutoAds() {
  useEffect(() => {
    if (!import.meta.env.VITE_ADSENSE_CLIENT_ID) return

    const script = document.createElement('script')
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${import.meta.env.VITE_ADSENSE_CLIENT_ID}`
    script.async = true
    script.crossOrigin = 'anonymous'
    document.head.appendChild(script)

    return () => {
      // Cleanup if needed
      const existingScript = document.querySelector(`script[src*="${import.meta.env.VITE_ADSENSE_CLIENT_ID}"]`)
      if (existingScript) {
        existingScript.remove()
      }
    }
  }, [])

  return null
}

declare global {
  interface Window {
    adsbygoogle: any[]
  }
}
