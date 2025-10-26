'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import PostForm from '@/components/PostForm'
import { PenTool, FileText } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function CreatePostPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading, token } = useAuth()
  const [draft, setDraft] = useState(null)
  const [loadingDraft, setLoadingDraft] = useState(false)

  const draftId = searchParams.get('draft')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (draftId && token) {
      loadDraft(draftId)
    }
  }, [draftId, token])

  const loadDraft = async (id) => {
    try {
      setLoadingDraft(true)
      const response = await fetch(`/api/drafts/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load draft')
      }

      setDraft(data.draft)
    } catch (error) {
      toast.error(error.message)
      router.push('/create') // Redirect to clean create page
    } finally {
      setLoadingDraft(false)
    }
  }

  const handlePostCreated = (post) => {
    router.push(`/posts/${post.id}`)
  }

  if (loading || loadingDraft) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <PenTool className="h-8 w-8 text-primary-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {loadingDraft ? 'Loading Draft...' : 'Create New Post'}
            </h1>
          </div>
        </div>
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              {draft ? <FileText className="h-8 w-8 text-blue-600" /> : <PenTool className="h-8 w-8 text-primary-600" />}
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {draft ? 'Edit Draft' : 'Create New Post'}
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              {draft 
                ? 'Continue working on your draft. Changes are automatically saved.'
                : 'Share your thoughts and stories with the community. Your work is automatically saved as you type.'
              }
            </p>
          </div>
          {draft && (
            <a 
              href="/drafts" 
              className="btn-secondary inline-flex items-center space-x-2"
            >
              <FileText className="h-4 w-4" />
              <span>All Drafts</span>
            </a>
          )}
        </div>
      </div>

      <div className="card">
        <PostForm draft={draft} onSubmit={handlePostCreated} />
      </div>
    </div>
  )
}