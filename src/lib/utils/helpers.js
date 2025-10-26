// Helper Functions - Utility functions used across the application

/**
 * Format date to readable string
 */
export const formatDate = (dateString, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  
  return new Date(dateString).toLocaleDateString('en-US', {
    ...defaultOptions,
    ...options,
  })
}

/**
 * Format time to readable string
 */
export const formatTime = (dateString, options = {}) => {
  const defaultOptions = {
    hour: '2-digit',
    minute: '2-digit',
  }
  
  return new Date(dateString).toLocaleTimeString('en-US', {
    ...defaultOptions,
    ...options,
  })
}

/**
 * Calculate reading time for content
 */
export const getReadingTime = (content, wordsPerMinute = 200) => {
  const words = content.split(' ').length
  const minutes = Math.ceil(words / wordsPerMinute)
  return `${minutes} min read`
}

/**
 * Truncate text to specified length
 */
export const truncateText = (text, maxLength = 150, suffix = '...') => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + suffix
}

/**
 * Generate excerpt from content
 */
export const generateExcerpt = (content, maxLength = 150) => {
  return truncateText(content, maxLength)
}

/**
 * Capitalize first letter of string
 */
export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Convert string to slug format
 */
export const slugify = (str) => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Debounce function calls
 */
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Throttle function calls
 */
export const throttle = (func, limit) => {
  let inThrottle
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

/**
 * Deep clone object
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * Check if object is empty
 */
export const isEmpty = (obj) => {
  return Object.keys(obj).length === 0
}

/**
 * Generate random ID
 */
export const generateId = (length = 8) => {
  return Math.random().toString(36).substring(2, length + 2)
}

/**
 * Format number with commas
 */
export const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/**
 * Get initials from name
 */
export const getInitials = (name) => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate URL format
 */
export const isValidUrl = (url) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Get file extension from filename
 */
export const getFileExtension = (filename) => {
  return filename.split('.').pop().toLowerCase()
}

/**
 * Format file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    return false
  }
}

/**
 * Get current URL
 */
export const getCurrentUrl = () => {
  return typeof window !== 'undefined' ? window.location.href : ''
}

/**
 * Scroll to element
 */
export const scrollToElement = (elementId, behavior = 'smooth') => {
  const element = document.getElementById(elementId)
  if (element) {
    element.scrollIntoView({ behavior })
  }
}

/**
 * Check if user is on mobile device
 */
export const isMobile = () => {
  return typeof window !== 'undefined' && window.innerWidth < 768
}

/**
 * Get browser info
 */
export const getBrowserInfo = () => {
  if (typeof window === 'undefined') return null
  
  const userAgent = window.navigator.userAgent
  const isChrome = userAgent.includes('Chrome')
  const isFirefox = userAgent.includes('Firefox')
  const isSafari = userAgent.includes('Safari') && !isChrome
  const isEdge = userAgent.includes('Edge')
  
  return { isChrome, isFirefox, isSafari, isEdge }
}