import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json({ error: 'Email parameter is required' }, { status: 400 })
    }

    // Get user and their submissions
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select(`
        id,
        email,
        mobile_number,
        author_name,
        created_at,
        articles (
          id,
          title,
          docx_url,
          payment_screenshot_url,
          status,
          created_at
        )
      `)
      .eq('email', email)
      .single()

    if (userError) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('User submissions fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user submissions' },
      { status: 500 }
    )
  }
}
