// API Index - Central export point for all API functions

export { default as apiClient } from './client'
export { default as postsApi } from './posts'
export { default as draftsApi } from './drafts'
export { default as authApi } from './auth'

// Re-export for convenience
export * from './client'
export * from './posts'
export * from './drafts'
export * from './auth'