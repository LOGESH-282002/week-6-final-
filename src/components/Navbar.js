'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import SafeThemeToggle from '@/components/SafeThemeToggle'
import HamburgerButton from '@/components/HamburgerButton'
import { PenTool, LogOut, User, Home, BookOpen, FileText } from 'lucide-react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const mobileMenuRef = useRef(null)
  const hamburgerRef = useRef(null)

  const toggleMobileMenu = (e) => {
    e.stopPropagation()
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  // Close mobile menu when clicking outside and manage scroll
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Only close if clicking outside both the menu and hamburger button
      const isClickInsideMenu = mobileMenuRef.current?.contains(event.target)
      const isClickInsideHamburger = hamburgerRef.current?.contains(event.target)
      
      if (!isClickInsideMenu && !isClickInsideHamburger) {
        closeMobileMenu()
      }
    }

    if (isMobileMenuOpen) {
      // Use a small delay to avoid immediate closure
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside)
      }, 100)
      // Prevent background scroll and add blur effect when menu is open
      document.body.classList.add('mobile-menu-open')
      document.body.style.overflow = 'hidden'
      
      // Add blur to main content (everything except the navbar)
      const mainContent = document.querySelector('main')
      if (mainContent) {
        mainContent.classList.add('mobile-menu-blur')
      }
    } else {
      // Restore scroll and remove blur when menu is closed
      document.body.classList.remove('mobile-menu-open')
      document.body.style.overflow = ''
      
      // Remove blur from main content
      const mainContent = document.querySelector('main')
      if (mainContent) {
        mainContent.classList.remove('mobile-menu-blur')
      }
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      // Always restore scroll and remove blur on cleanup
      document.body.classList.remove('mobile-menu-open')
      document.body.style.overflow = ''
      const mainContent = document.querySelector('main')
      if (mainContent) {
        mainContent.classList.remove('mobile-menu-blur')
      }
    }
  }, [isMobileMenuOpen])

  // Close mobile menu on route change
  useEffect(() => {
    const handleRouteChange = () => {
      closeMobileMenu()
    }

    // Listen for route changes (simplified)
    window.addEventListener('popstate', handleRouteChange)
    return () => window.removeEventListener('popstate', handleRouteChange)
  }, [])

  // Cleanup scroll and blur on component unmount
  useEffect(() => {
    return () => {
      document.body.classList.remove('mobile-menu-open')
      document.body.style.overflow = ''
      const mainContent = document.querySelector('main')
      if (mainContent) {
        mainContent.classList.remove('mobile-menu-blur')
      }
    }
  }, [])

  return (
    <>
      {/* Mobile Menu Backdrop with Blur */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-30 sm:hidden transition-all duration-300"
          onClick={closeMobileMenu}
        />
      )}

      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div className="flex items-center space-x-4 sm:space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <PenTool className="h-6 w-6 sm:h-8 sm:w-8 text-primary-600" />
              <span className="heading-responsive-sm text-gray-900 dark:text-gray-100">Blogify</span>
            </Link>
            
            <div className="hidden sm:flex items-center space-x-4 lg:space-x-6">
              <Link 
                href="/" 
                className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
              
              <Link 
                href="/posts" 
                className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                <BookOpen className="h-4 w-4" />
                <span>All Posts</span>
              </Link>
              
              {user && (
                <>
                  <Link 
                    href="/drafts" 
                    className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Drafts</span>
                  </Link>
                  <Link 
                    href="/create" 
                    className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                  >
                    <PenTool className="h-4 w-4" />
                    <span>Write</span>
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="hidden sm:block">
              <SafeThemeToggle />
            </div>
            
            {/* Desktop Auth */}
            {user ? (
              <div className="hidden sm:flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{user.name}</span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors text-sm"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-4">
                <Link 
                  href="/login" 
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors text-sm"
                >
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className="btn-primary text-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <div className="sm:hidden" ref={hamburgerRef}>
              <HamburgerButton 
                isOpen={isMobileMenuOpen}
                onClick={toggleMobileMenu}
                className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div 
          ref={mobileMenuRef}
          className={`sm:hidden transition-all duration-300 ease-in-out relative z-50 ${
            isMobileMenuOpen 
              ? 'max-h-96 opacity-100 transform translate-y-0' 
              : 'max-h-0 opacity-0 overflow-hidden transform -translate-y-2'
          }`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-2xl backdrop-blur-sm">
            {/* Navigation Links */}
            <Link 
              href="/" 
              onClick={closeMobileMenu}
              className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>
            
            <Link 
              href="/posts" 
              onClick={closeMobileMenu}
              className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <BookOpen className="h-5 w-5" />
              <span>All Posts</span>
            </Link>
            
            {user && (
              <>
                <Link 
                  href="/drafts" 
                  onClick={closeMobileMenu}
                  className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <FileText className="h-5 w-5" />
                  <span>Drafts</span>
                </Link>
                <Link 
                  href="/create" 
                  onClick={closeMobileMenu}
                  className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <PenTool className="h-5 w-5" />
                  <span>Write</span>
                </Link>
              </>
            )}

            {/* Mobile Theme Toggle */}
            <div className="px-3 py-2">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 flex items-center justify-center">
                  <div className="w-4 h-4 bg-gray-400 dark:bg-gray-500 rounded-full"></div>
                </div>
                <span className="text-gray-600 dark:text-gray-300">Theme</span>
                <div className="ml-auto">
                  <SafeThemeToggle />
                </div>
              </div>
            </div>

            {/* Mobile Auth */}
            {user ? (
              <>
                <div className="px-3 py-2 border-t border-gray-200 dark:border-gray-700 mt-2 pt-3">
                  <div className="flex items-center space-x-3 mb-3">
                    <User className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{user.name}</span>
                  </div>
                  <button
                    onClick={() => {
                      logout()
                      closeMobileMenu()
                    }}
                    className="flex items-center space-x-3 px-3 py-2 rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="px-3 py-2 border-t border-gray-200 dark:border-gray-700 mt-2 pt-3 space-y-2">
                <Link 
                  href="/login" 
                  onClick={closeMobileMenu}
                  className="block px-3 py-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Login
                </Link>
                <Link 
                  href="/register" 
                  onClick={closeMobileMenu}
                  className="block px-3 py-2 rounded-md bg-primary-600 text-white hover:bg-primary-700 transition-colors text-center font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
    </>
  )
}