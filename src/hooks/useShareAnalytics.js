'use client'

import { useCallback } from 'react'

export function useShareAnalytics() {
  const trackShare = useCallback((platform, postId, postTitle) => {
    // Track sharing events for analytics
    // This could be integrated with Google Analytics, Mixpanel, etc.
    
    if (typeof window !== 'undefined') {
      // Example: Google Analytics 4 event tracking
      if (window.gtag) {
        window.gtag('event', 'share', {
          method: platform,
          content_type: 'blog_post',
          item_id: postId,
          content_title: postTitle,
        })
      }

      // Example: Custom analytics
      console.log('Share tracked:', {
        platform,
        postId,
        postTitle,
        timestamp: new Date().toISOString(),
        url: window.location.href,
      })

      // You could also send this to your own analytics endpoint
      // fetch('/api/analytics/share', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ platform, postId, postTitle })
      // })
    }
  }, [])

  const trackCopyLink = useCallback((postId, postTitle) => {
    trackShare('copy_link', postId, postTitle)
  }, [trackShare])

  const trackNativeShare = useCallback((postId, postTitle) => {
    trackShare('native_share', postId, postTitle)
  }, [trackShare])

  return {
    trackShare,
    trackCopyLink,
    trackNativeShare,
  }
}