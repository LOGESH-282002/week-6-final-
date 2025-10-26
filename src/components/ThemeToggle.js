'use client'

import { useTheme } from '@/contexts/ThemeContext'
import { Sun, Moon, Monitor } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

export default function ThemeToggle({ showLabel = false, variant = 'button' }) {
  const [mounted, setMounted] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render anything until mounted to avoid hydration issues
  if (!mounted) {
    return (
      <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 transition-colors">
        <div className="h-5 w-5 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
      </div>
    )
  }

  // Now we can safely use the theme context
  const { theme, toggleTheme, setLightTheme, setDarkTheme, setSystemTheme, isDark } = useTheme()

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (variant === 'simple') {
    return (
      <button
        onClick={toggleTheme}
        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      >
        {isDark ? (
          <Sun className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        ) : (
          <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        )}
      </button>
    )
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-2 p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
        aria-label="Theme options"
      >
        {isDark ? (
          <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        ) : (
          <Sun className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        )}
        {showLabel && (
          <span className="text-sm text-gray-600 dark:text-gray-300 capitalize">
            {theme}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
          <button
            onClick={() => {
              setLightTheme()
              setShowDropdown(false)
            }}
            className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Sun className="h-4 w-4" />
            <span>Light</span>
            {theme === 'light' && (
              <div className="ml-auto w-2 h-2 bg-primary-600 rounded-full"></div>
            )}
          </button>
          
          <button
            onClick={() => {
              setDarkTheme()
              setShowDropdown(false)
            }}
            className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Moon className="h-4 w-4" />
            <span>Dark</span>
            {theme === 'dark' && (
              <div className="ml-auto w-2 h-2 bg-primary-600 rounded-full"></div>
            )}
          </button>
          
          <button
            onClick={() => {
              setSystemTheme()
              setShowDropdown(false)
            }}
            className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Monitor className="h-4 w-4" />
            <span>System</span>
            {!localStorage.getItem('blogify-theme') && (
              <div className="ml-auto w-2 h-2 bg-primary-600 rounded-full"></div>
            )}
          </button>
        </div>
      )}
    </div>
  )
}