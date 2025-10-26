import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { generateToken } from '@/lib/auth'
import { authOptions } from '../[...nextauth]/route'

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Generate JWT token for NextAuth users
    const token = generateToken({ 
      userId: session.user.id, 
      email: session.user.email 
    })

    return NextResponse.json({
      user: session.user,
      token,
    })
  } catch (error) {
    console.error('Session error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}