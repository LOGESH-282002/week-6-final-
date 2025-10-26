import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'
import { sanitizeInput } from '@/lib/validation'

// GET all drafts for authenticated user
export async function GET(request) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 10
    const offset = (page - 1) * limit

    const { data: drafts, error } = await supabaseAdmin
      .from('drafts')
      .select(`
        id,
        title,
        content,
        created_at,
        updated_at,
        users (
          id,
          name,
          email
        )
      `)
      .eq('author_id', decoded.userId)
      .order('updated_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch drafts' },
        { status: 500 }
      )
    }

    return NextResponse.json({ drafts })
  } catch (error) {
    console.error('Get drafts error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST create or update draft
export async function POST(request) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    const { title, content, draftId } = await request.json()

    // Basic validation - drafts can be empty
    if (!title && !content) {
      return NextResponse.json(
        { error: 'Title or content is required' },
        { status: 400 }
      )
    }

    // Sanitize input
    const sanitizedTitle = title ? sanitizeInput(title) : 'Untitled Draft'
    const sanitizedContent = content ? sanitizeInput(content) : ''

    if (draftId) {
      // Update existing draft
      const { data: draft, error } = await supabaseAdmin
        .from('drafts')
        .update({
          title: sanitizedTitle,
          content: sanitizedContent,
          updated_at: new Date().toISOString(),
        })
        .eq('id', draftId)
        .eq('author_id', decoded.userId)
        .select(`
          id,
          title,
          content,
          created_at,
          updated_at,
          users (
            id,
            name,
            email
          )
        `)
        .single()

      if (error) {
        console.error('Database error:', error)
        return NextResponse.json(
          { error: 'Failed to update draft' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        message: 'Draft updated successfully',
        draft,
      })
    } else {
      // Create new draft
      const { data: draft, error } = await supabaseAdmin
        .from('drafts')
        .insert([
          {
            title: sanitizedTitle,
            content: sanitizedContent,
            author_id: decoded.userId,
          },
        ])
        .select(`
          id,
          title,
          content,
          created_at,
          updated_at,
          users (
            id,
            name,
            email
          )
        `)
        .single()

      if (error) {
        console.error('Database error:', error)
        return NextResponse.json(
          { error: 'Failed to create draft' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        message: 'Draft saved successfully',
        draft,
      })
    }
  } catch (error) {
    console.error('Save draft error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}