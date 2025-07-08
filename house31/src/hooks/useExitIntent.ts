'use client'

import { useEffect, useState, useRef } from 'react'

interface UseExitIntentOptions {
  threshold?: number // pixels from top to trigger
  delay?: number // ms of inactivity before triggering
  onExitIntent?: () => void
}

export function useExitIntent({ 
  threshold = 50, 
  delay = 10000, // 10 seconds
  onExitIntent 
}: UseExitIntentOptions = {}) {
  const [hasTriggered, setHasTriggered] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const lastActivityRef = useRef(Date.now())

  useEffect(() => {
    if (hasTriggered) return

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if mouse is leaving from the top of the page
      if (e.clientY <= threshold && e.relatedTarget === null) {
        if (!hasTriggered) {
          setHasTriggered(true)
          onExitIntent?.()
        }
      }
    }

    const handleBeforeUnload = () => {
      if (!hasTriggered) {
        setHasTriggered(true)
        onExitIntent?.()
      }
    }

    const resetInactivityTimer = () => {
      lastActivityRef.current = Date.now()
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      
      timeoutRef.current = setTimeout(() => {
        if (!hasTriggered) {
          setHasTriggered(true)
          onExitIntent?.()
        }
      }, delay)
    }

    const handleActivity = () => {
      resetInactivityTimer()
    }

    const handleVisibilityChange = () => {
      if (document.hidden && !hasTriggered) {
        setHasTriggered(true)
        onExitIntent?.()
      }
    }

    // Mouse leave detection
    document.addEventListener('mouseleave', handleMouseLeave)
    
    // Page unload detection
    window.addEventListener('beforeunload', handleBeforeUnload)
    
    // Visibility change detection (tab switching)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    // Activity tracking for inactivity detection
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
    events.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true })
    })

    // Start the inactivity timer
    resetInactivityTimer()

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      
      events.forEach(event => {
        document.removeEventListener(event, handleActivity)
      })
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [threshold, delay, onExitIntent, hasTriggered])

  const reset = () => {
    setHasTriggered(false)
    lastActivityRef.current = Date.now()
  }

  return {
    hasTriggered,
    reset
  }
}
