'use client'

import { PenTool, ArrowRight, Sparkles } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function HeroSection() {
  const { token } = useAuth()

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-72 h-72 bg-primary-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 left-0 -mt-4 -ml-4 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-12 lg:py-12">
        <div className="text-center">

          {/* Main heading */}
          <h1 className="heading-responsive-xl text-gray-900 dark:text-gray-100 mb-4 sm:mb-6 leading-tight transition-colors">
            Share Your
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600">
              {" "}Stories
            </span>
            <br />
            With the World
          </h1>

          {/* Subtitle */}
          <p className="text-responsive-lg text-gray-600 dark:text-gray-300 mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed transition-colors px-4">
            Join thousands of writers who trust Blogify to share their thoughts, 
            build their audience, and create meaningful connections through the power of words.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
            {token ? (
              <a 
                href="/create" 
                className="btn-primary inline-flex items-center space-x-2 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto justify-center"
              >
                <PenTool className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>Start Writing</span>
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
            ) : (
              <>
                <a 
                  href="/register" 
                  className="btn-primary inline-flex items-center space-x-2 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto justify-center"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </a>
                <a 
                  href="/login" 
                  className="btn-secondary inline-flex items-center space-x-2 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto justify-center"
                >
                  <span>Sign In</span>
                </a>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="heading-responsive-md text-gray-900 dark:text-gray-100">10K+</div>
              <div className="text-responsive-sm text-gray-600 dark:text-gray-400">Active Writers</div>
            </div>
            <div className="text-center">
              <div className="heading-responsive-md text-gray-900 dark:text-gray-100">50K+</div>
              <div className="text-responsive-sm text-gray-600 dark:text-gray-400">Stories Published</div>
            </div>
            <div className="text-center">
              <div className="heading-responsive-md text-gray-900 dark:text-gray-100">1M+</div>
              <div className="text-responsive-sm text-gray-600 dark:text-gray-400">Monthly Readers</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}