'use client'

import { useConfetti } from '@/hooks/useConfetti'
import { showCelebrationToast } from '@/components/CelebrationToast'
import { Sparkles } from 'lucide-react'

export default function ConfettiButton({ 
  children = 'Celebrate!', 
  type = 'publish',
  message,
  className = '',
  variant = 'primary'
}) {
  const { fireSideCannons, fireFireworks, fireCelebration } = useConfetti()

  const handleClick = () => {
    // Show celebration toast
    showCelebrationToast(message, type)
    
    // Fire confetti based on type
    setTimeout(() => {
      switch (type) {
        case 'publish':
          fireSideCannons()
          break
        case 'achievement':
          fireFireworks()
          break
        case 'milestone':
          fireCelebration()
          break
        default:
          fireSideCannons()
      }
    }, 300)
  }

  const baseClasses = 'inline-flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105'
  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700',
    secondary: 'bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-600 hover:to-blue-600',
    success: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600',
  }

  return (
    <button
      onClick={handleClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      <Sparkles className="h-4 w-4" />
      <span>{children}</span>
    </button>
  )
}