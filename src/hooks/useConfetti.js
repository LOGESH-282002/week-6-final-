'use client'

import { useCallback } from 'react'

export function useConfetti() {
  const fireConfetti = useCallback(async (options = {}) => {
    // Dynamic import to avoid SSR issues
    const confetti = (await import('canvas-confetti')).default

    const defaults = {
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'],
    }

    confetti({
      ...defaults,
      ...options,
    })
  }, [])

  const fireSideCannons = useCallback(async () => {
    const confetti = (await import('canvas-confetti')).default

    const duration = 3000
    const animationEnd = Date.now() + duration
    const defaults = {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 0,
      colors: ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#EC4899'],
    }

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      // Left side cannon
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      })

      // Right side cannon
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      })
    }, 250)
  }, [])

  const fireFireworks = useCallback(async () => {
    const confetti = (await import('canvas-confetti')).default

    const duration = 2000
    const animationEnd = Date.now() + duration
    const defaults = {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 0,
    }

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)
      
      // Random fireworks from different positions
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.2 },
        colors: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7']
      })
    }, 250)
  }, [])

  const fireCelebration = useCallback(async () => {
    const confetti = (await import('canvas-confetti')).default

    // First burst from center
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'],
    })

    // Side cannons after a short delay
    setTimeout(() => {
      fireSideCannons()
    }, 500)
  }, [fireSideCannons])

  return {
    fireConfetti,
    fireSideCannons,
    fireFireworks,
    fireCelebration,
  }
}