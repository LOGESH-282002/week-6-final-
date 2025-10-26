import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'

// GET single draft
export async function GET(request, { params }) {
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

    const { data: draft, error } = await supabaseAdmin
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
      .eq('id', params.id)
      .eq('author_id', decoded.userId)
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Draft not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ draft })
  } catch (error) {
    console.error('Get draft error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE draft
export async function DELETE(request, { params }) {
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

    const { error } = await supabaseAdmin
      .from('drafts')
      .delete()
      .eq('id', params.id)
      .eq('author_id', decoded.userId)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to delete draft' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Draft deleted successfully',
    })
  } catch (error) {
    console.error('Delete draft error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST publish draft as post
export async function POST(request, { params }) {
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

    // Get the draft
    const { data: draft, error: draftError } = await supabaseAdmin
      .from('drafts')
      .select('*')
      .eq('id', params.id)
      .eq('author_id', decoded.userId)
      .single()

    if (draftError || !draft) {
      return NextResponse.json(
        { error: 'Draft not found' },
        { status: 404 }
      )
    }

    // Validate draft has content
    if (!draft.title || !draft.content) {
      return NextResponse.json(
        { error: 'Draft must have title and content to publish' },
        { status: 400 }
      )
    }

    // Create excerpt
    const excerpt = draft.content.substring(0, 150) + '...'

    // Create post from draft
    const { data: post, error: postError } = await supabaseAdmin
      .from('posts')
      .insert([
        {
          title: draft.title,
          content: draft.content,
          excerpt,
          author_id: decoded.userId,
        },
      ])
      .select(`
        id,
        title,
        content,
        excerpt,
        created_at,
        updated_at,
        users (
          id,
          name,
          email
        )
      `)
      .single()

    if (postError) {
      console.error('Database error:', postError)
      return NextResponse.json(
        { error: 'Failed to publish draft' },
        { status: 500 }
      )
    }

    // Delete the draft after successful publish
    await supabaseAdmin
      .from('drafts')
      .delete()
      .eq('id', params.id)
      .eq('author_id', decoded.userId)

    return NextResponse.json({
      message: 'Draft published successfully',
      post,
    })
  } catch (error) {
    console.error('Publish draft error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}