'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { useAuth } from '@/contexts/AuthContext'
import PostCard from '@/components/PostCard'
import HeroSection from '@/components/HeroSection'
import FeatureCard from '@/components/FeatureCard'
import CTASection from '@/components/CTASection'
import { PostGridSkeleton } from '@/components/PostCardSkeleton'
import { 
  PenTool, 
  BookOpen, 
  Users, 
  Shield, 
  Zap, 
  Globe, 
  Heart,
  TrendingUp 
} from 'lucide-react'

export default function HomePage() {
  const { token } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      // Only fetch first 6 posts for home page
      const response = await fetch('/api/posts?page=1&limit=6')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch posts')
      }

      setPosts(data.posts)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePost = async (postId) => {
    if (!token) {
      toast.error('Please login to delete posts')
      return
    }

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete post')
      }

      setPosts(posts.filter(post => post.id !== postId))
      toast.success('Post deleted successfully')
    } catch (error) {
      toast.error(error.message)
    }
  }

  const features = [
    {
      icon: PenTool,
      title: "Easy Writing",
      description: "Intuitive editor with rich formatting options. Focus on your content while we handle the rest.",
      highlight: false
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Connect with fellow writers, share ideas, and build meaningful relationships in our vibrant community.",
      highlight: true
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your content is protected with enterprise-grade security. Write with confidence knowing your data is safe.",
      highlight: false
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized for speed and performance. Your readers will enjoy a seamless experience on any device.",
      highlight: false
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Share your stories with readers worldwide. Built-in SEO optimization helps your content get discovered.",
      highlight: false
    },
    {
      icon: TrendingUp,
      title: "Analytics Insights",
      description: "Track your post performance and understand your audience with detailed analytics and engagement metrics.",
      highlight: false
    }
  ]

  return (
    <div>
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <section className="py-12 sm:py-20 bg-white dark:bg-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="heading-responsive-lg text-gray-900 dark:text-gray-100 mb-4 text-break-words">
              Why Choose Blogify?
            </h2>
            <p className="text-responsive-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto text-break-words">
              Everything you need to create, share, and grow your blog. 
              Built by writers, for writers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                highlight={feature.highlight}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Posts Section */}
      <section className="py-12 sm:py-20 bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="heading-responsive-lg text-gray-900 dark:text-gray-100 mb-4 text-break-words">
              Latest Stories
            </h2>
            <p className="text-responsive-lg text-gray-600 dark:text-gray-300 text-break-words">
              Discover amazing content from our community of writers
            </p>
          </div>

          {loading ? (
            <PostGridSkeleton count={6} />
          ) : posts.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">No posts yet</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
                Be the first to share your story and inspire others in our community!
              </p>
              {token && (
                <a href="/create" className="btn-primary inline-flex items-center space-x-2">
                  <PenTool className="h-5 w-5" />
                  <span>Create First Post</span>
                </a>
              )}
            </div>
          ) : (
            <>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onDelete={handleDeletePost}
                  />
                ))}
              </div>
              
              {posts.length > 0 && (
                <div className="text-center mt-12">
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Showing {posts.length} latest {posts.length === 1 ? 'story' : 'stories'}
                  </p>
                  <a 
                    href="/posts" 
                    className="btn-secondary inline-flex items-center space-x-2 mb-8"
                  >
                    <BookOpen className="h-5 w-5" />
                    <span>View All Posts</span>
                  </a>
                  {!token && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
                      <Heart className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        Love what you're reading?
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-6">
                        Join our community to start writing your own stories and connect with other writers.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a href="/register" className="btn-primary">
                          Get Started Free
                        </a>
                        <a href="/login" className="btn-secondary">
                          Sign In
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />
    </div>
  )
}