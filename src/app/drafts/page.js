'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { useAuth } from '@/contexts/AuthContext'
import { PostGridSkeleton } from '@/components/PostCardSkeleton'
import Pagination from '@/components/Pagination'
import { useConfetti } from '@/hooks/useConfetti'
import { showCelebrationToast } from '@/components/CelebrationToast'
import {
  FileText,
  Edit3,
  Trash2,
  Send,
  Calendar,
  Clock,
  PlusCircle
} from 'lucide-react'

export default function DraftsPage() {
  const { token, user } = useAuth()
  const [drafts, setDrafts] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [draftsPerPage] = useState(9)
  const [paginatedDrafts, setPaginatedDrafts] = useState([])

  // Confetti hook
  const { fireSideCannons } = useConfetti()

  useEffect(() => {
    if (token) {
      fetchDrafts()
    }
  }, [token])

  useEffect(() => {
    paginateDrafts()
  }, [drafts, currentPage])

  const fetchDrafts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/drafts', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch drafts')
      }

      setDrafts(data.drafts)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const paginateDrafts = () => {
    const startIndex = (currentPage - 1) * draftsPerPage
    const endIndex = startIndex + draftsPerPage
    setPaginatedDrafts(drafts.slice(startIndex, endIndex))
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDeleteDraft = async (draftId) => {
    if (!confirm('Are you sure you want to delete this draft?')) {
      return
    }

    try {
      const response = await fetch(`/api/drafts/${draftId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete draft')
      }

      setDrafts(drafts.filter(draft => draft.id !== draftId))
      toast.success('Draft deleted successfully')
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handlePublishDraft = async (draftId) => {
    if (!confirm('Are you sure you want to publish this draft? It will be moved to your published posts.')) {
      return
    }

    try {
      const response = await fetch(`/api/drafts/${draftId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to publish draft')
      }

      setDrafts(drafts.filter(draft => draft.id !== draftId))

      // Show celebration for published draft
      showCelebrationToast('✨ Your draft is now published and live!', 'draft')

      // Fire confetti celebration
      setTimeout(() => {
        fireSideCannons()
      }, 500)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getPreview = (content) => {
    return content.length > 150 ? content.substring(0, 150) + '...' : content
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <FileText className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-6" />
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Please log in to view your drafts
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            You need to be logged in to access your saved drafts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/login" className="btn-primary">
              Sign In
            </a>
            <a href="/register" className="btn-secondary">
              Create Account
            </a>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            My Drafts
          </h1>
          <p className="text-xl text-gray-600">
            Your saved drafts and work in progress
          </p>
        </div>
        <PostGridSkeleton count={9} />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
              My Drafts
            </h1>
            <p className="text-sm md:text-xl text-gray-600 dark:text-gray-300">
              Your saved drafts and work in progress
            </p>
          </div>
          <a
            href="/create"
            className="btn-primary inline-flex items-center space-x-2"
          >
            <PlusCircle className="h-5 w-5" />
            <span>New</span>
          </a>
        </div>
      </div>

      {/* Drafts Grid */}
      {drafts.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <FileText className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-6" />
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            No drafts yet
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
            Start writing your first draft! Your work will be automatically saved as you type.
          </p>
          <a href="/create" className="btn-primary inline-flex items-center space-x-2">
            <Edit3 className="h-5 w-5" />
            <span>Start Writing</span>
          </a>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {paginatedDrafts.map((draft) => (
              <div key={draft.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 break">
                      {draft.title || 'Untitled Draft'}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Created {formatDate(draft.created_at)}</span>
                      </div>
                      {draft.updated_at !== draft.created_at && (
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>Updated {formatDate(draft.updated_at)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Content Preview */}
                <div className="mb-6">
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed break">
                    {draft.content ? getPreview(draft.content) : 'No content yet...'}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-2">
                    <a
                      href={`/create?draft=${draft.id}`}
                      className="inline-flex items-center space-x-1 text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      <Edit3 className="h-4 w-4" />
                      <span>Edit</span>
                    </a>

                    <button
                      onClick={() => handlePublishDraft(draft.id)}
                      className="inline-flex items-center space-x-1 text-green-600 hover:text-green-700 text-sm font-medium"
                      disabled={!draft.title || !draft.content}
                    >
                      <Send className="h-4 w-4" />
                      <span>Publish</span>
                    </button>
                  </div>

                  <button
                    onClick={() => handleDeleteDraft(draft.id)}
                    className="inline-flex items-center space-x-1 text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {drafts.length > draftsPerPage && (
            <div className="mt-12">
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(drafts.length / draftsPerPage)}
                onPageChange={handlePageChange}
                totalItems={drafts.length}
                itemsPerPage={draftsPerPage}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}