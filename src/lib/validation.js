export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password) => {
  return password && password.length >= 6
}

export const validateName = (name) => {
  return name && name.trim().length >= 2
}

export const validateBlogPost = (title, content) => {
  const errors = {}
  
  if (!title || title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters long'
  }
  
  if (!content || content.trim().length < 10) {
    errors.content = 'Content must be at least 10 characters long'
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input
  return input.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
}