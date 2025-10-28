'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { useAuth } from '@/contexts/AuthContext'
import { useAutoSave } from '@/hooks/useAutoSave'
import { useConfetti } from '@/hooks/useConfetti'
import { showCelebrationToast } from '@/components/CelebrationToast'
import { Save, FileText, Send } from 'lucide-react'

export default function PostForm({ post, draft, onSubmit, isEditing = false }) {
  const { token } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [draftId, setDraftId] = useState(draft?.id || null)
  const [title, setTitle] = useState(post?.title || draft?.title || '')
  const [content, setContent] = useState(post?.content || draft?.content || '')

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      title: title,
      content: content,
    },
  })

  // Watch form values for auto-save
  const watchedTitle = watch('title')
  const watchedContent = watch('content')

  // Update local state when form values change
  useEffect(() => {
    setTitle(watchedTitle || '')
  }, [watchedTitle])

  useEffect(() => {
    setContent(watchedContent || '')
  }, [watchedContent])

  // Auto-save hook
  const { manualSave, isSaving } = useAutoSave(title, content, draftId, setDraftId)

  // Confetti hook
  const { fireSideCannons } = useConfetti()

  const onFormSubmit = async (data) => {
    if (!token) {
      toast.error('Please login to continue')
      return
    }

    setIsSubmitting(true)

    try {
      const url = isEditing ? `/api/posts/${post.id}` : '/api/posts'
      const method = isEditing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save post')
      }

      // If we published from a draft, delete the draft
      if (draftId && !isEditing) {
        try {
          await fetch(`/api/drafts/${draftId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          })
        } catch (error) {
          console.error('Failed to delete draft after publishing:', error)
        }
      }

      if (isEditing) {
        toast.success('Post updated successfully!')
      } else {
        // Check if this might be user's first post (simple heuristic)
        const isLikelyFirstPost = data.title.toLowerCase().includes('first') ||
          data.content.toLowerCase().includes('first post') ||
          data.title.toLowerCase().includes('hello world')

        if (isLikelyFirstPost) {
          showCelebrationToast('🎉 Congratulations on your first post! Welcome to the Blogify community!', 'milestone')
        } else {
          showCelebrationToast('🎉 Your story is now live for the world to read!', 'publish')
        }

        // Fire confetti
        setTimeout(() => {
          fireSideCannons()
        }, 500)
      }

      onSubmit(result.post)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveDraft = () => {
    manualSave()
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Title
        </label>
        <input
          type="text"
          id="title"
          {...register('title', {
            required: 'Title is required',
            minLength: {
              value: 3,
              message: 'Title must be at least 3 characters long',
            },
          })}
          className="input-field"
          placeholder="Enter your post title..."
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Content
        </label>
        <textarea
          id="content"
          rows={12}
          {...register('content', {
            required: 'Content is required',
            minLength: {
              value: 10,
              message: 'Content must be at least 10 characters long',
            },
          })}
          className="input-field resize-none"
          placeholder="Write your post content here..."
        />
        {errors.content && (
          <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
        )}
      </div>

      {/* Auto-save indicator */}
      {token && (title.trim() || content.trim()) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
          <div className="flex items-center space-x-2 text-blue-700 dark:text-blue-300">
            <FileText className="h-4 w-4" />
            <span className="text-sm">
              {isSaving ? 'Saving draft...' : 'Draft auto-saved'}
            </span>
          </div>
          {draftId && (
            <a
              href="/drafts"
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
            >
              View all drafts
            </a>
          )}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="btn-secondary"
            disabled={isSubmitting}
          >
            Cancel
          </button>

          {token && !isEditing && (
            <button
              type="button"
              onClick={handleSaveDraft}
              className="btn-secondary inline-flex items-center justify-center space-x-2"
              disabled={isSubmitting || isSaving}
            >
              <Save className="h-4 w-4" />
              <span>{isSaving ? 'Saving...' : 'Save Draft'}</span>
            </button>
          )}
        </div>

        <button
          type="submit"
          className="btn-primary inline-flex items-center justify-center space-x-2"
          disabled={isSubmitting}
        >
          <Send className="h-4 w-4" />
          <span>
            {isSubmitting
              ? (isEditing ? 'Updating...' : 'Publishing...')
              : (isEditing ? 'Update Post' : 'Publish Post')
            }
          </span>
        </button>
      </div>
    </form>
  )
}