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
    // Use supabaseAdmin for server-side API routes to bypass RLS
    // Filter only approved articles for public display
    const { data: articles, error } = await supabaseAdmin
      .from('articles')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      throw new Error(`Failed to fetch articles: ${error.message}`)
    }

    console.log(`✅ Fetched ${articles?.length || 0} approved articles`)
    
    return NextResponse.json(
      { articles: articles || [] },
      { headers: corsHeaders(request.headers.get('origin')) }
    )
  } catch (error: any) {
    console.error('Articles fetch error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch articles',
        details: error?.message || 'Unknown error'
      },
      { status: 500, headers: corsHeaders(request.headers.get('origin')) }
    )
  }
}
