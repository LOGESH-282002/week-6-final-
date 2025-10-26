'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { useAuth } from '@/contexts/AuthContext'
import PostForm from '@/components/PostForm'
import { Edit3, ArrowLeft } from 'lucide-react'

export default function EditPostPage() {
  const params = useParams()
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
      return
    }

    if (params.id && user) {
      fetchPost()
    }
  }, [params.id, user, authLoading, router])

  const fetchPost = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/posts/${params.id}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch post')
      }

      // Check if user is the author
      if (data.post.users.id !== user.id) {
        toast.error('You can only edit your own posts')
        router.push(`/posts/${params.id}`)
        return
      }

      setPost(data.post)
    } catch (error) {
      toast.error(error.message)
      router.push('/posts')
    } finally {
      setLoading(false)
    }
  }

  const handlePostUpdated = (updatedPost) => {
    toast.success('Post updated successfully!')
    router.push(`/posts/${updatedPost.id}`)
  }

  if (authLoading || loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Edit3 className="h-8 w-8 text-primary-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Edit Post</h1>
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

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Post not found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The post you're trying to edit doesn't exist or you don't have permission to edit it.
          </p>
          <button
            onClick={() => router.push('/posts')}
            className="btn-primary inline-flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Posts</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <Edit3 className="h-8 w-8 text-primary-600" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Edit Post</h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Make changes to your post. Updates are saved automatically as you type.
            </p>
          </div>
          <button
            onClick={() => router.push(`/posts/${post.id}`)}
            className="btn-secondary inline-flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Post</span>
          </button>
        </div>
      </div>

      <div className="card">
        <PostForm 
          post={post} 
          onSubmit={handlePostUpdated} 
          isEditing={true} 
        />
      </div>
    </div>
  )
}