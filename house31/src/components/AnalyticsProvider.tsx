"use client"

import { useAnalytics, useScrollTracking, useTimeTracking } from '@/lib/analytics'

interface AnalyticsProviderProps {
  children: React.ReactNode
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  // Initialize analytics and tracking hooks
  useAnalytics()
  useScrollTracking()
  useTimeTracking()

  return <>{children}</>
}
