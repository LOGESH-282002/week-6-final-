// Constants - Application-wide constants

// App Configuration
export const APP_CONFIG = {
  name: 'Blogify',
  description: 'A modern full-stack blogging platform',
  version: '1.0.0',
  author: 'Blogify Team',
}

// API Configuration
export const API_CONFIG = {
  baseURL: '/api',
  timeout: 10000,
  retries: 3,
}

// Pagination
export const PAGINATION = {
  defaultLimit: 10,
  maxLimit: 100,
  defaultPage: 1,
}

// Post Configuration
export const POST_CONFIG = {
  titleMinLength: 3,
  titleMaxLength: 255,
  contentMinLength: 10,
  contentMaxLength: 50000,
  excerptLength: 150,
}

// Draft Configuration
export const DRAFT_CONFIG = {
  autoSaveDelay: 2000, // 2 seconds
  maxDrafts: 100,
}

// Theme Configuration
export const THEME_CONFIG = {
  default: 'light',
  storageKey: 'blogify-theme',
  options: ['light', 'dark', 'system'],
}

// Share Configuration
export const SHARE_CONFIG = {
  platforms: {
    twitter: 'https://twitter.com/intent/tweet',
    facebook: 'https://www.facebook.com/sharer/sharer.php',
    linkedin: 'https://www.linkedin.com/sharing/share-offsite/',
    whatsapp: 'https://wa.me/',
    email: 'mailto:',
  },
}

// Validation Rules
export const VALIDATION_RULES = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: false,
  },
  username: {
    minLength: 3,
    maxLength: 30,
    pattern: /^[a-zA-Z0-9_-]+$/,
  },
}

// Error Messages
export const ERROR_MESSAGES = {
  network: 'Network error. Please check your connection.',
  unauthorized: 'You are not authorized to perform this action.',
  notFound: 'The requested resource was not found.',
  validation: 'Please check your input and try again.',
  server: 'Server error. Please try again later.',
  unknown: 'An unexpected error occurred.',
}

// Success Messages
export const SUCCESS_MESSAGES = {
  postCreated: 'Post created successfully!',
  postUpdated: 'Post updated successfully!',
  postDeleted: 'Post deleted successfully!',
  draftSaved: 'Draft saved successfully!',
  draftPublished: 'Draft published successfully!',
  loginSuccess: 'Welcome back!',
  registerSuccess: 'Account created successfully!',
  logoutSuccess: 'Logged out successfully!',
}

// Routes
export const ROUTES = {
  home: '/',
  posts: '/posts',
  drafts: '/drafts',
  create: '/create',
  login: '/login',
  register: '/register',
  profile: '/profile',
}

// Local Storage Keys
export const STORAGE_KEYS = {
  theme: 'blogify-theme',
  token: 'blogify-token',
  user: 'blogify-user',
  drafts: 'blogify-drafts',
}

// Feature Flags
export const FEATURES = {
  darkMode: true,
  sharing: true,
  confetti: true,
  analytics: true,
  drafts: true,
  autoSave: true,
}