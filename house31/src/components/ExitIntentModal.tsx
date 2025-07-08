'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, X } from 'lucide-react'
import { useAnalytics } from '@/lib/analytics'

interface ExitIntentModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ExitIntentModal({ isOpen, onClose }: ExitIntentModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { trackEvent } = useAnalytics()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim() || !email.trim()) {
      return
    }

    setIsLoading(true)
    
    try {
      // Track the subscription attempt
      trackEvent('newsletter_signup', {
        source: 'exit_intent_popup',
        name: name.trim(),
        email: email.trim()
      })

      // Simulate API call - replace with actual newsletter signup
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setIsSubmitted(true)
      
      // Auto-close after success
      setTimeout(() => {
        onClose()
        setIsSubmitted(false)
        setName('')
        setEmail('')
      }, 2000)
      
    } catch (error) {
      console.error('Newsletter signup failed:', error)
      trackEvent('newsletter_signup_error', {
        source: 'exit_intent_popup',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    trackEvent('exit_intent_popup_dismissed', {
      had_interaction: name.length > 0 || email.length > 0
    })
    onClose()
  }

  // Track when modal is shown
  useEffect(() => {
    if (isOpen) {
      trackEvent('exit_intent_popup_shown', {
        timestamp: new Date().toISOString()
      })
    }
  }, [isOpen, trackEvent])

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md mx-4 rounded-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Mail className="h-5 w-5 text-primary" />
            Wait! Don't Miss Out
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {isSubmitted 
              ?              "Thank you for subscribing! Welcome to House31."
              : "Get the latest breaking news and exclusive content delivered straight to your inbox."
            }
          </DialogDescription>
        </DialogHeader>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button 
                type="submit" 
                className="flex-1"
                disabled={isLoading || !name.trim() || !email.trim()}
              >
                {isLoading ? 'Subscribing...' : 'Subscribe Now'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClose}
                className="px-3"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </form>
        ) : (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-sm text-muted-foreground">
              Check your email for a confirmation link.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
