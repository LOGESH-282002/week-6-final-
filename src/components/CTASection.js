'use client'

import { PenTool, ArrowRight, Sparkles } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function CTASection() {
  const { token } = useAuth()

  return (
    <section className="py-10 bg-gradient-to-r from-primary-600 to-purple-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center space-x-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-8">
          <Sparkles className="h-4 w-4" />
          <span>Join Our Community</span>
        </div>

        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Ready to Share Your Story?
        </h2>
        
        <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
          Join thousands of writers who have already discovered the joy of sharing their thoughts 
          and connecting with readers worldwide.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {token ? (
            <a 
              href="/create" 
              className="bg-white text-primary-600 hover:bg-gray-50 font-semibold py-4 px-8 rounded-lg transition-all duration-200 hover:shadow-lg hover:scale-105 inline-flex items-center justify-center space-x-2"
            >
              <PenTool className="h-5 w-5" />
              <span>Start Writing Now</span>
              <ArrowRight className="h-5 w-5" />
            </a>
          ) : (
            <>
              <a 
                href="/register" 
                className="bg-white text-primary-600 hover:bg-gray-50 font-semibold py-4 px-8 rounded-lg transition-all duration-200 hover:shadow-lg hover:scale-105 inline-flex items-center justify-center space-x-2"
              >
                <span>Get Started Free</span>
                <ArrowRight className="h-5 w-5" />
              </a>
              <a 
                href="/login" 
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-4 px-8 rounded-lg transition-all duration-200"
              >
                Sign In
              </a>
            </>
          )}
        </div>

        <p className="text-white/80 text-sm mt-6">
          No credit card required • Free forever • Join 10,000+ writers
        </p>
      </div>
    </section>
  )
}