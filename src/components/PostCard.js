'use client'

import Link from 'next/link'
import { Calendar, User, Edit, Trash2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import ShareButton from '@/components/ShareButton'

export default function PostCard({ post, onDelete }) {
  const { user } = useAuth()
  const isAuthor = user && user.id === post.users.id

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      onDelete(post.id)
    }
  }

  return (
    <article className="card-post">
      <div className="flex justify-between items-start mb-4">
        <Link href={`/posts/${post.id}`}>
          <h2 className="heading-responsive-sm text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors cursor-pointer text-break-words line-clamp-2 break">
            {post.title}
          </h2>
        </Link>

        {isAuthor && (
          <div className="flex items-center space-x-2">
            <Link
              href={`/posts/${post.id}/edit`}
              className="p-2 text-gray-400 dark:text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              <Edit className="h-4 w-4" />
            </Link>
            <button
              onClick={handleDelete}
              className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <p className="text-responsive-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed text-break-words line-clamp-3 break">
        {post.excerpt}
      </p>

      <div>
        <div className="flex items-center justify-between space-x-4 w-full">
          <div className="flex items-center space-x-1">
            <User className="h-4 w-4" />
            <span>{post.users.name}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(post.created_at)}</span>
          </div>
        </div>

        <div className="flex items-center space-x-3 w-full justify-end">
          <ShareButton
            url={`/posts/${post.id}`}
            title={post.title}
            description={post.excerpt}
            variant="simple"
            size="sm"
            postId={post.id}
          />

          <Link
            href={`/posts/${post.id}`}
            className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors"
          >
            Read more →
          </Link>
        </div>
      </div>
    </article>
  )
}