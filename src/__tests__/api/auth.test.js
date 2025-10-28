import { POST as registerPOST } from '@/app/api/auth/register/route'
import { POST as loginPOST } from '@/app/api/auth/login/route'
import { supabaseAdmin } from '@/lib/supabase'
import { hashPassword, verifyPassword } from '@/lib/auth'

// Mock Supabase
jest.mock('@/lib/supabase', () => ({
  supabaseAdmin: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(),
        })),
      })),
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(),
        })),
      })),
    })),
  },
}))

// Mock auth functions
jest.mock('@/lib/auth', () => ({
  hashPassword: jest.fn(),
  verifyPassword: jest.fn(),
  generateToken: jest.fn(() => 'mock-token'),
}))

describe('/api/auth/register', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    
    // Reset all mocks to default behavior
    supabaseAdmin.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn(),
        }),
      }),
      insert: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: jest.fn(),
        }),
      }),
    })
  })

  it('should register a new user successfully', async () => {
    const mockUser = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
    }

    // Mock the chain for checking existing user (no user found)
    const mockSingle1 = jest.fn().mockResolvedValue({
      data: null,
      error: { code: 'PGRST116' }, // Not found error
    })
    
    const mockEq1 = jest.fn().mockReturnValue({
      single: mockSingle1,
    })
    
    const mockSelect1 = jest.fn().mockReturnValue({
      eq: mockEq1,
    })

    // Mock the chain for creating user
    const mockSingle2 = jest.fn().mockResolvedValue({
      data: mockUser,
      error: null,
    })
    
    const mockSelect2 = jest.fn().mockReturnValue({
      single: mockSingle2,
    })
    
    const mockInsert = jest.fn().mockReturnValue({
      select: mockSelect2,
    })

    // Set up the from mock to return different chains based on call order
    let callCount = 0
    supabaseAdmin.from.mockImplementation(() => {
      callCount++
      if (callCount === 1) {
        return { select: mockSelect1 }
      } else {
        return { insert: mockInsert }
      }
    })

    hashPassword.mockResolvedValue('hashed-password')

    const request = new Request('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      }),
    })

    const response = await registerPOST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.user).toEqual(mockUser)
    expect(data.token).toBe('mock-token')
  })

  it('should return error for invalid email', async () => {
    const request = new Request('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'John Doe',
        email: 'invalid-email',
        password: 'password123',
      }),
    })

    const response = await registerPOST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Please provide a valid email address')
  })
})

describe('/api/auth/login', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    
    // Reset all mocks to default behavior
    supabaseAdmin.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn(),
        }),
      }),
    })
  })

  it('should login user successfully', async () => {
    const mockUser = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashed-password',
    }

    // Mock the chain for finding user
    const mockSingle = jest.fn().mockResolvedValue({
      data: mockUser,
      error: null,
    })
    
    const mockEq = jest.fn().mockReturnValue({
      single: mockSingle,
    })
    
    const mockSelect = jest.fn().mockReturnValue({
      eq: mockEq,
    })

    supabaseAdmin.from.mockReturnValue({
      select: mockSelect,
    })

    verifyPassword.mockResolvedValue(true)

    const request = new Request('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'john@example.com',
        password: 'password123',
      }),
    })

    const response = await loginPOST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.user.email).toBe('john@example.com')
    expect(data.token).toBe('mock-token')
  })

  it('should return error for invalid credentials', async () => {
    // Mock the chain for user not found
    const mockSingle = jest.fn().mockResolvedValue({
      data: null,
      error: { code: 'PGRST116' },
    })
    
    const mockEq = jest.fn().mockReturnValue({
      single: mockSingle,
    })
    
    const mockSelect = jest.fn().mockReturnValue({
      eq: mockEq,
    })

    supabaseAdmin.from.mockReturnValue({
      select: mockSelect,
    })

    const request = new Request('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'john@example.com',
        password: 'wrongpassword',
      }),
    })

    const response = await loginPOST(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Invalid email or password')
  })
})