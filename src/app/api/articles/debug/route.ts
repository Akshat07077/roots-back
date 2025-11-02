import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// Debug endpoint to check all articles regardless of status
// This helps diagnose if articles exist but aren't approved
export async function GET() {
  try {
    const { data: allArticles, error } = await supabaseAdmin
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Debug Supabase error:', error)
      return NextResponse.json(
        { 
          error: 'Failed to fetch articles',
          details: error.message 
        },
        { status: 500 }
      )
    }

    const statusCounts = {
      total: allArticles?.length || 0,
      pending: allArticles?.filter(a => a.status === 'pending').length || 0,
      approved: allArticles?.filter(a => a.status === 'approved').length || 0,
      rejected: allArticles?.filter(a => a.status === 'rejected').length || 0
    }

    return NextResponse.json({
      statusCounts,
      articles: allArticles || [],
      message: `Found ${statusCounts.total} total articles. ${statusCounts.approved} approved, ${statusCounts.pending} pending, ${statusCounts.rejected} rejected.`
    })
  } catch (error: any) {
    console.error('Debug articles fetch error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch articles',
        details: error?.message || 'Unknown error'
      },
      { status: 500 }
    )
  }
}

