'use client'

import { useState, useRef, useEffect } from 'react'
import { 
  Share2, 
  Twitter, 
  Facebook, 
  Linkedin, 
  Link2, 
  Mail, 
  MessageCircle,
  Check,
  Copy
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useShareAnalytics } from '@/hooks/useShareAnalytics'

export default function ShareButton({ 
  url, 
  title, 
  description = '', 
  variant = 'button',
  size = 'md',
  showLabel = true,
  postId = null
}) {
  const [showDropdown, setShowDropdown] = useState(false)
  const [copied, setCopied] = useState(false)
  const dropdownRef = useRef(null)
  const { trackShare, trackCopyLink, trackNativeShare } = useShareAnalytics()

  const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}${url}` : url
  const encodedUrl = encodeURIComponent(fullUrl)
  const encodedTitle = encodeURIComponent(title)
  const encodedDescription = encodeURIComponent(description)

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const shareOptions = [
    {
      name: 'Twitter',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      color: 'hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: 'hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-400'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: 'hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-800 dark:hover:text-blue-400'
    },
    {
      name: 'Email',
      icon: Mail,
      url: `mailto:?subject=${encodedTitle}&body=Check out this article: ${encodedUrl}`,
      color: 'hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300'
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      url: `https://wa.me/?text=${encodedTitle} ${encodedUrl}`,
      color: 'hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 dark:hover:text-green-400'
    }
  ]

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url: fullUrl,
        })
        trackNativeShare(postId, title)
        setShowDropdown(false)
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error sharing:', error)
          toast.error('Failed to share')
        }
      }
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl)
      setCopied(true)
      toast.success('Link copied to clipboard!')
      trackCopyLink(postId, title)
      
      setTimeout(() => {
        setCopied(false)
        setShowDropdown(false)
      }, 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
      toast.error('Failed to copy link')
    }
  }

  const handleSocialShare = (shareUrl, platform) => {
    window.open(shareUrl, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes')
    trackShare(platform, postId, title)
    setShowDropdown(false)
  }

  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3'
  }

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  }

  if (variant === 'simple') {
    // If native sharing is supported, use it directly
    if (typeof window !== 'undefined' && navigator.share) {
      return (
        <button
          onClick={handleNativeShare}
          className={`${sizeClasses[size]} rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors`}
          aria-label="Share post"
        >
          <Share2 className={`${iconSizes[size]} text-gray-600 dark:text-gray-300`} />
        </button>
      )
    }

    // Fallback to social sharing options
    return (
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className={`${sizeClasses[size]} rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors relative`}
        aria-label="Share post"
      >
        <Share2 className={`${iconSizes[size]} text-gray-600 dark:text-gray-300`} />
        
        {showDropdown && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
            {/* Social Share Options Only */}
            {shareOptions.map((option) => {
              const Icon = option.icon
              return (
                <button
                  key={option.name}
                  onClick={() => handleSocialShare(option.url, option.name.toLowerCase())}
                  className={`flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 transition-colors ${option.color}`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{option.name}</span>
                </button>
              )
            })}
          </div>
        )}
      </button>
    )
  }

  // If native sharing is supported, use it directly for button variant too
  if (typeof window !== 'undefined' && navigator.share) {
    return (
      <button
        onClick={handleNativeShare}
        className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
      >
        <Share2 className="h-5 w-5" />
        {showLabel && <span>Share</span>}
      </button>
    )
  }

  // Fallback to social sharing options
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
      >
        <Share2 className="h-5 w-5" />
        {showLabel && <span>Share</span>}
      </button>

      {showDropdown && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-3 z-50">
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Share this post</h3>
          </div>

          {/* Social Share Options Only */}
          <div className="grid grid-cols-2 gap-2 px-4 pt-3">
            {shareOptions.map((option) => {
              const Icon = option.icon
              return (
                <button
                  key={option.name}
                  onClick={() => handleSocialShare(option.url, option.name.toLowerCase())}
                  className={`flex flex-col items-center space-y-2 p-3 rounded-lg transition-colors ${option.color}`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs font-medium">{option.name}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}