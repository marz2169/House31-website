'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAnalytics } from '@/lib/analytics'
import { useExitIntentModal } from '@/components/ExitIntentProvider'

export function AnalyticsDebugPanel() {
  const [events, setEvents] = useState<string[]>([])
  const { trackEvent, trackVideoClick, trackScrollDepth } = useAnalytics()
  const { showModal } = useExitIntentModal()

  // Test functions
  const testPageView = () => {
    trackEvent('test_page_view', { source: 'debug_panel' })
    addEvent('Page view tracked')
  }

  const testVideoClick = () => {
    trackVideoClick('Test Video Title', 'AI', 1)
    addEvent('Video click tracked')
  }

  const testScrollDepth = () => {
    trackScrollDepth(50)
    addEvent('Scroll depth (50%) tracked')
  }

  const testExitIntent = () => {
    showModal()
    addEvent('Exit intent popup triggered')
  }

  const testAdClick = () => {
    trackEvent('ad_click', { 
      category: 'advertising',
      ad_location: 'sidebar',
      ad_type: 'rectangle'
    })
    addEvent('Ad click tracked')
  }

  const addEvent = (event: string) => {
    setEvents(prev => [`${new Date().toLocaleTimeString()}: ${event}`, ...prev.slice(0, 9)])
  }

  // Check environment setup
  const hasGA = !!process.env.NEXT_PUBLIC_GA_TRACKING_ID
  const hasAdSense = !!process.env.NEXT_PUBLIC_ADSENSE_CLIENT
  const isDev = process.env.NODE_ENV === 'development'

  useEffect(() => {
    addEvent('Debug panel loaded')
  }, [])

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🔧 Analytics Debug Panel
          {isDev && <Badge variant="secondary">DEV MODE</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Environment Status */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm">Environment Status:</h4>
          <div className="flex gap-2 flex-wrap">
            <Badge variant={hasGA ? "default" : "destructive"}>
              GA4: {hasGA ? "✓" : "✗"}
            </Badge>
            <Badge variant={hasAdSense ? "default" : "destructive"}>
              AdSense: {hasAdSense ? "✓" : "✗"}
            </Badge>
          </div>
        </div>

        {/* Test Buttons */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm">Test Analytics Events:</h4>
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={testPageView} size="sm" variant="outline">
              Page View
            </Button>
            <Button onClick={testVideoClick} size="sm" variant="outline">
              Video Click
            </Button>
            <Button onClick={testScrollDepth} size="sm" variant="outline">
              Scroll Depth
            </Button>
            <Button onClick={testExitIntent} size="sm" variant="outline">
              Exit Intent
            </Button>
            <Button onClick={testAdClick} size="sm" variant="outline">
              Ad Click
            </Button>
          </div>
        </div>

        {/* Event Log */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm">Recent Events:</h4>
          <div className="bg-muted rounded p-2 h-32 overflow-y-auto">
            {events.length === 0 ? (
              <p className="text-xs text-muted-foreground">No events yet...</p>
            ) : (
              events.map((event, index) => (
                <div key={index} className="text-xs font-mono mb-1">
                  {event}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Check browser console for detailed logs</p>
          <p>• Open GA4 Real-time reports to see events</p>
          <p>• Exit intent only works in production mode</p>
        </div>
      </CardContent>
    </Card>
  )
}
