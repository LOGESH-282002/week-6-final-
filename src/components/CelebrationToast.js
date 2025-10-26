'use client'

import { useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { useConfetti } from '@/hooks/useConfetti'
import { Trophy, Sparkles, Zap, Star } from 'lucide-react'

export function showCelebrationToast(message, type = 'success') {
  const celebrationTypes = {
    publish: {
      icon: Sparkles,
      color: 'from-blue-500 to-purple-600',
      message: message || '🎉 Post published successfully!',
    },
    draft: {
      icon: Star,
      color: 'from-green-500 to-blue-500',
      message: message || '✨ Draft published successfully!',
    },
    achievement: {
      icon: Trophy,
      color: 'from-yellow-500 to-orange-500',
      message: message || '🏆 Achievement unlocked!',
    },
    milestone: {
      icon: Zap,
      color: 'from-pink-500 to-red-500',
      message: message || '⚡ Milestone reached!',
    },
  }

  const config = celebrationTypes[type] || celebrationTypes.publish
  const Icon = config.icon

  toast.custom(
    (t) => (
      <div
        className={`
          ${t.visible ? 'animate-enter' : 'animate-leave'}
          max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5
        `}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${config.color} flex items-center justify-center`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Congratulations! 🎉
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {config.message}
              </p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-gray-200">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Close
          </button>
        </div>
      </div>
    ),
    {
      duration: 5000,
      position: 'top-center',
    }
  )
}

export default function CelebrationToast({ type = 'publish', message, onShow }) {
  const { fireSideCannons } = useConfetti()

  useEffect(() => {
    if (onShow) {
      // Show celebration toast
      showCelebrationToast(message, type)
      
      // Fire confetti after a short delay
      setTimeout(() => {
        fireSideCannons()
      }, 300)
    }
  }, [onShow, message, type, fireSideCannons])

  return null
}