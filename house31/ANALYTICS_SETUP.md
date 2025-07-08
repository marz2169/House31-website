# House31 Analytics & Monetization Setup

This document explains how to configure and use the advanced analytics, AdSense monetization, and exit intent features in the House31 website.

## Features Implemented

### 🔍 Advanced Analytics (Google Analytics 4)
- **Page view tracking** - Automatic tracking of all page visits
- **Video click tracking** - Track when users click on video cards
- **Scroll depth tracking** - Monitor how far users scroll on pages
- **Time on site tracking** - Track user engagement duration
- **Exit intent tracking** - Analytics for popup interactions
- **Ad interaction tracking** - Monitor ad clicks and performance

### 💰 Google AdSense Monetization
- **Auto ads integration** - Automatic ad placement across the site
- **Custom ad slots** - Strategic ad placement in sidebar and content areas
- **Responsive ads** - Ads adapt to different screen sizes
- **Fallback CTAs** - Show engaging content when ads don't load
- **Dark mode compatibility** - Ads respect the site's theme

### 🚪 Exit Intent Popup
- **Smart detection** - Triggers on tab close attempts or 10s inactivity
- **Newsletter signup** - Captures leads before users leave
- **One-time display** - Respects user experience with single popup
- **Analytics integration** - Tracks popup performance and conversions
- **Responsive design** - Works across all devices

## Quick Setup

1. **Copy environment file:**
   ```bash
   cp .env.example .env.local
   ```

2. **Configure your analytics:**
   ```env
   NEXT_PUBLIC_GA_TRACKING_ID=G-XXXXXXXXXX
   NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-xxxxxxxxxxxxxxxxx
   ```

3. **Get your IDs:**
   - **GA4**: Visit [Google Analytics](https://analytics.google.com/) → Admin → Data Streams → Web → Measurement ID
   - **AdSense**: Visit [Google AdSense](https://www.google.com/adsense/) → Account → Settings → Account Information → Publisher ID

## Component Usage

### Analytics Tracking

```tsx
import { useAnalytics } from '@/lib/analytics'

function MyComponent() {
  const { trackEvent } = useAnalytics()
  
  const handleVideoClick = () => {
    trackEvent('video_click', {
      video_id: 'video-123',
      video_title: 'AI Revolution',
      category: 'technology'
    })
  }
  
  return <button onClick={handleVideoClick}>Play Video</button>
}
```

### AdSense Integration

```tsx
import { AdSense } from '@/components/AdSense'

function Sidebar() {
  return (
    <div>
      <AdSense 
        adSlot="1234567890"
        adFormat="rectangle"
        fallbackCTA={{
          title: "Support Our Content",
          description: "Help us create more amazing videos",
          buttonText: "Subscribe",
          buttonLink: "/subscribe"
        }}
      />
    </div>
  )
}
```

### Exit Intent Modal

```tsx
import { useExitIntentModal } from '@/components/ExitIntentProvider'

function MyPage() {
  const { showModal } = useExitIntentModal()
  
  // Manual trigger (optional)
  const handleSpecialOffer = () => {
    showModal()
  }
  
  return <button onClick={handleSpecialOffer}>Special Offer</button>
}
```

## Analytics Events Reference

| Event Name | Description | Parameters |
|------------|-------------|------------|
| `page_view` | Page visit | `page_title`, `page_location` |
| `video_click` | Video interaction | `video_id`, `video_title`, `category` |
| `scroll_depth` | Scroll progress | `depth_percentage`, `page_url` |
| `time_on_site` | Session duration | `time_spent_seconds`, `page_url` |
| `exit_intent_popup_shown` | Popup displayed | `timestamp` |
| `newsletter_signup` | Subscription attempt | `source`, `name`, `email` |
| `ad_load_attempt` | Ad loading | `ad_slot`, `ad_format` |
| `fallback_cta_click` | Fallback CTA clicked | `ad_slot`, `cta_link` |

## Ad Slots Configuration

Current ad slots in the site:

| Location | Ad Slot ID | Format | Fallback CTA |
|----------|------------|--------|--------------|
| Sidebar | `1234567890` | Rectangle | Subscribe CTA |
| Below Videos | `9876543210` | Horizontal | Browse Videos CTA |

To add more ad slots, use the `AdSense` component with unique slot IDs.

## Development vs Production

- **Development**: Exit intent popup is disabled, analytics use debug mode
- **Production**: All features are fully active with real tracking

## Performance Considerations

- Analytics scripts are loaded asynchronously
- AdSense uses lazy loading for better performance
- Exit intent detection is optimized to minimize CPU usage
- All components respect dark mode preferences

## Troubleshooting

### Analytics Not Working
1. Check if `NEXT_PUBLIC_GA_TRACKING_ID` is set correctly
2. Verify the GA4 property is configured for your domain
3. Check browser console for any script loading errors

### Ads Not Showing
1. Ensure `NEXT_PUBLIC_ADSENSE_CLIENT` is correct
2. Verify your AdSense account is approved
3. Check if ad blockers are interfering

### Exit Intent Not Triggering
1. Confirm you're in production mode (`NODE_ENV=production`)
2. Test by moving mouse to top of browser and out
3. Wait 10 seconds without activity to test inactivity trigger

## Privacy & GDPR Compliance

The implementation includes privacy-conscious defaults:
- No personal data is stored without consent
- Analytics can be disabled via environment variables
- Exit intent respects user interaction patterns
- All tracking is transparent and documented

## Next Steps

1. Set up Google Analytics 4 goals for conversions
2. Configure AdSense optimization experiments
3. A/B test different exit intent triggers
4. Monitor performance metrics and optimize accordingly

For support, check the component source files or create an issue in the repository.
