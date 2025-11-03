import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { corsHeaders } from '@/lib/cors'

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders(request.headers.get('origin')),
  })
}

export async function GET(request: NextRequest) {
  try {
    const { data: articles, error } = await supabaseAdmin
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch articles: ${error.message}`)
    }

    return NextResponse.json(
      { articles },
      { headers: corsHeaders(request.headers.get('origin')) }
    )
  } catch (error) {
    console.error('Admin articles fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500, headers: corsHeaders(request.headers.get('origin')) }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, status } = await request.json()

    if (!id || !status) {
      return NextResponse.json(
        { error: 'Article ID and status are required' },
        { status: 400, headers: corsHeaders(request.headers.get('origin')) }
      )
    }

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be pending, approved, or rejected' },
        { status: 400, headers: corsHeaders(request.headers.get('origin')) }
      )
    }

    const { data: article, error } = await supabaseAdmin
      .from('articles')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update article: ${error.message}`)
    }

    return NextResponse.json(
      {
        success: true,
        article
      },
      { headers: corsHeaders(request.headers.get('origin')) }
    )
  } catch (error) {
    console.error('Article update error:', error)
    return NextResponse.json(
      { error: 'Failed to update article' },
      { status: 500, headers: corsHeaders(request.headers.get('origin')) }
    )
  }
}
