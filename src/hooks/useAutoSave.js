'use client'

import { useEffect, useRef, useCallback } from 'react'
import { toast } from 'react-hot-toast'
import { useAuth } from '@/contexts/AuthContext'

export function useAutoSave(title, content, draftId, setDraftId, delay = 2000) {
  const { token } = useAuth()
  const timeoutRef = useRef(null)
  const lastSavedRef = useRef({ title: '', content: '' })
  const isSavingRef = useRef(false)

  const saveDraft = useCallback(async (currentTitle, currentContent, currentDraftId) => {
    if (!token || isSavingRef.current) return

    // Don't save if nothing has changed
    if (
      currentTitle === lastSavedRef.current.title && 
      currentContent === lastSavedRef.current.content
    ) {
      return
    }

    // Don't save if both title and content are empty
    if (!currentTitle.trim() && !currentContent.trim()) {
      return
    }

    try {
      isSavingRef.current = true
      
      const response = await fetch('/api/drafts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: currentTitle || 'Untitled Draft',
          content: currentContent,
          draftId: currentDraftId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save draft')
      }

      // Update the draft ID if this was a new draft
      if (!currentDraftId && data.draft?.id) {
        setDraftId(data.draft.id)
      }

      // Update last saved reference
      lastSavedRef.current = {
        title: currentTitle,
        content: currentContent,
      }

      // Show subtle success message
      toast.success('Draft saved', {
        duration: 1500,
        style: {
          background: '#10B981',
          color: 'white',
          fontSize: '14px',
        },
      })
    } catch (error) {
      console.error('Auto-save error:', error)
      toast.error('Failed to save draft', {
        duration: 2000,
      })
    } finally {
      isSavingRef.current = false
    }
  }, [token, setDraftId])

  // Auto-save effect
  useEffect(() => {
    if (!token) return

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Set new timeout for auto-save
    timeoutRef.current = setTimeout(() => {
      saveDraft(title, content, draftId)
    }, delay)

    // Cleanup timeout on unmount or dependency change
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [title, content, draftId, delay, saveDraft, token])

  // Save before page unload
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      // Check if there are unsaved changes
      if (
        token &&
        (title !== lastSavedRef.current.title || content !== lastSavedRef.current.content) &&
        (title.trim() || content.trim())
      ) {
        // Try to save immediately (this might not complete due to page unload)
        saveDraft(title, content, draftId)
        
        // Show browser confirmation dialog
        e.preventDefault()
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?'
        return e.returnValue
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [title, content, draftId, token, saveDraft])

  // Manual save function
  const manualSave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    saveDraft(title, content, draftId)
  }, [title, content, draftId, saveDraft])

  return {
    manualSave,
    isSaving: isSavingRef.current,
  }
}