'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { useAuth } from '@/contexts/AuthContext'
import PostCard from '@/components/PostCard'
import LoadingSpinner from '@/components/LoadingSpinner'
import Pagination from '@/components/Pagination'
import { PostGridSkeleton } from '@/components/PostCardSkeleton'
import {
  Search,
  Filter,
  BookOpen,
  Calendar,
  User,
  TrendingUp
} from 'lucide-react'

export default function AllPostsPage() {
  const { token } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [filteredPosts, setFilteredPosts] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [postsPerPage, setPostsPerPage] = useState(9) // 3x3 grid
  const [paginatedPosts, setPaginatedPosts] = useState([])

  useEffect(() => {
    fetchPosts()
  }, [])

  useEffect(() => {
    filterAndSortPosts()
  }, [posts, searchTerm, sortBy])

  useEffect(() => {
    paginatePosts()
  }, [filteredPosts, currentPage])

  useEffect(() => {
    // Reset to first page when search, sort, or posts per page changes
    setCurrentPage(1)
  }, [searchTerm, sortBy, postsPerPage])

  const fetchPosts = async (page = 1, limit = 50) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/posts?page=${page}&limit=${limit}`)
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

  const filterAndSortPosts = () => {
    let filtered = posts

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author?.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Sort posts
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at) - new Date(a.created_at)
        case 'oldest':
          return new Date(a.created_at) - new Date(b.created_at)
        case 'title':
          return a.title.localeCompare(b.title)
        case 'author':
          return (a.author?.name || '').localeCompare(b.author?.name || '')
        default:
          return new Date(b.created_at) - new Date(a.created_at)
      }
    })

    setFilteredPosts(filtered)
  }

  const paginatePosts = () => {
    const startIndex = (currentPage - 1) * postsPerPage
    const endIndex = startIndex + postsPerPage
    setPaginatedPosts(filteredPosts.slice(startIndex, endIndex))
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    // Scroll to top of posts section
    window.scrollTo({ top: 0, behavior: 'smooth' })
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

  const getSortIcon = (sortType) => {
    switch (sortType) {
      case 'newest':
      case 'oldest':
        return Calendar
      case 'title':
        return BookOpen
      case 'author':
        return User
      default:
        return TrendingUp
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            All Stories
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Discover amazing content from our community of writers
          </p>
        </div>

        {/* Search and Filter Bar Skeleton */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 animate-pulse">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 h-10 bg-gray-200 rounded-lg"></div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="h-10 bg-gray-200 rounded-lg w-40"></div>
              <div className="h-10 bg-gray-200 rounded-lg w-32"></div>
            </div>
          </div>
        </div>

        {/* Posts Grid Skeleton */}
        <PostGridSkeleton count={9} />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          All Stories
        </h1>
        <p className="text-xl text-gray-600">
          Discover amazing content from our community of writers
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search posts, authors, or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10 pr-4"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* Sort Dropdown */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="select-field pl-10 pr-8 py-2 min-w-[160px]"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">Title A-Z</option>
                <option value="author">Author A-Z</option>
              </select>
            </div>

            {/* Posts Per Page Selector */}
            <div className="relative">
              <select
                value={postsPerPage}
                onChange={(e) => setPostsPerPage(parseInt(e.target.value))}
                className="select-field px-3 py-2 min-w-[120px]"
              >
                <option value={6}>6 per page</option>
                <option value={9}>9 per page</option>
                <option value={12}>12 per page</option>
                <option value={18}>18 per page</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
          <span>
            {filteredPosts.length} {filteredPosts.length === 1 ? 'story' : 'stories'} found
            {searchTerm && ` for "${searchTerm}"`}
            {filteredPosts.length > postsPerPage && (
              <span className="ml-2 text-gray-500 dark:text-gray-400">
                • Page {currentPage} of {Math.ceil(filteredPosts.length / postsPerPage)}
              </span>
            )}
          </span>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
            >
              Clear search
            </button>
          )}
        </div>
      </div>

      {/* Posts Grid */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-6" />
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {searchTerm ? 'No posts found' : 'No posts yet'}
          </h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            {searchTerm
              ? `No posts match your search for "${searchTerm}". Try different keywords or browse all posts.`
              : 'Be the first to share your story and inspire others in our community!'
            }
          </p>
          {searchTerm ? (
            <button
              onClick={() => setSearchTerm('')}
              className="btn-primary"
            >
              Show All Posts
            </button>
          ) : token && (
            <a href="/create" className="btn-primary">
              Create First Post
            </a>
          )}
        </div>
      ) : (
        <>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {paginatedPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onDelete={handleDeletePost}
              />
            ))}
          </div>

          {/* Pagination */}
          {filteredPosts.length > postsPerPage && (
            <div className="mt-12">
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(filteredPosts.length / postsPerPage)}
                onPageChange={handlePageChange}
                totalItems={filteredPosts.length}
                itemsPerPage={postsPerPage}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
              />
            </div>
          )}

          {/* CTA Section for non-authenticated users */}
          {!token && (
            <div className="mt-12">
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Ready to share your story?
                </h3>
                <p className="text-gray-600 mb-6">
                  Join our community and start writing your own posts.
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
            </div>
          )}
        </>
      )}
    </div>
  )
}