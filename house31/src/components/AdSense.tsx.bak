'use client'

import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ExternalLink } from 'lucide-react'
import { useAnalytics } from '@/lib/analytics'

interface AdSenseProps {
  adSlot: string
  adFormat?: 'auto' | 'rectangle' | 'vertical' | 'horizontal'
  style?: React.CSSProperties
  className?: string
  fallbackCTA?: {
    title: string
    description: string
    buttonText: string
    buttonLink: string
  }
}

export function AdSense({ 
  adSlot, 
  adFormat = 'auto', 
  style = {},
  className = '',
  fallbackCTA = {
    title: "Support House31",
    description: "Help us keep bringing you the latest news and stories.",
    buttonText: "Learn More",
    buttonLink: "/about"
  }
}: AdSenseProps) {
  const adRef = useRef<HTMLModElement>(null)
  const { trackEvent } = useAnalytics()
  const hasAdLoaded = useRef(false)

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT

    if (!clientId || !adSlot) {
      console.warn('AdSense client ID or ad slot not configured')
      return
    }

    // Check if AdSense is available
    if (typeof window !== 'undefined' && (window as Record<string, unknown>).adsbygoogle) {
      try {
        // Push the ad configuration
        (((window as Record<string, unknown>).adsbygoogle as unknown[]) = ((window as Record<string, unknown>).adsbygoogle as unknown[]) || []).push({})
        hasAdLoaded.current = true
        
        // Track ad load attempt
        trackEvent('ad_load_attempt', {
          ad_slot: adSlot,
          ad_format: adFormat
        })
      } catch (error) {
        console.error('AdSense load error:', error)
        trackEvent('ad_load_error', {
          ad_slot: adSlot,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }
  }, [adSlot, adFormat, trackEvent])

  const handleFallbackClick = () => {
    trackEvent('fallback_cta_click', {
      ad_slot: adSlot,
      cta_link: fallbackCTA.buttonLink
    })
  }

  // Check if we should show fallback
  const showFallback = !process.env.NEXT_PUBLIC_ADSENSE_CLIENT || !hasAdLoaded.current

  if (showFallback) {
    return (
      <Card className={`border-dashed border-2 border-muted ${className}`} style={style}>
        <CardContent className="p-6 text-center space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground">
              {fallbackCTA.title}
            </h3>
            <p className="text-xs text-muted-foreground">
              {fallbackCTA.description}
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={handleFallbackClick}
            asChild
          >
            <a href={fallbackCTA.buttonLink} target="_blank" rel="noopener noreferrer">
              {fallbackCTA.buttonText}
              <ExternalLink className="ml-2 h-3 w-3" />
            </a>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={className} style={style}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
    </div>
  )
}
