import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'
import { validateBlogPost, sanitizeInput } from '@/lib/validation'

// GET single post
export async function GET(request, { params }) {
  try {
    const { data: post, error } = await supabaseAdmin
      .from('posts')
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
          email,
          created_at
        )
      `)
      .eq('id', params.id)
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ post })
  } catch (error) {
    console.error('Get post error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT update post
export async function PUT(request, { params }) {
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

    const { title, content } = await request.json()

    // Validate input
    const validation = validateBlogPost(title, content)
    if (!validation.isValid) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 400 }
      )
    }

    // Sanitize input
    const sanitizedTitle = sanitizeInput(title)
    const sanitizedContent = sanitizeInput(content)
    const excerpt = sanitizedContent.substring(0, 150) + '...'

    // Check if user owns the post
    const { data: existingPost, error: fetchError } = await supabaseAdmin
      .from('posts')
      .select('author_id')
      .eq('id', params.id)
      .single()

    if (fetchError || !existingPost) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    if (existingPost.author_id !== decoded.userId) {
      return NextResponse.json(
        { error: 'Unauthorized to update this post' },
        { status: 403 }
      )
    }

    // Update post
    const { data: post, error } = await supabaseAdmin
      .from('posts')
      .update({
        title: sanitizedTitle,
        content: sanitizedContent,
        excerpt,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
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

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to update post' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Post updated successfully',
      post,
    })
  } catch (error) {
    console.error('Update post error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE post
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

    // Check if user owns the post
    const { data: existingPost, error: fetchError } = await supabaseAdmin
      .from('posts')
      .select('author_id')
      .eq('id', params.id)
      .single()

    if (fetchError || !existingPost) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    if (existingPost.author_id !== decoded.userId) {
      return NextResponse.json(
        { error: 'Unauthorized to delete this post' },
        { status: 403 }
      )
    }

    // Delete post
    const { error } = await supabaseAdmin
      .from('posts')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to delete post' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Post deleted successfully',
    })
  } catch (error) {
    console.error('Delete post error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}