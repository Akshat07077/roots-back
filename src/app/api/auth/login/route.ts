import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Create Supabase client for authentication
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase configuration missing')
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Authenticate user with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password: password
    })

    if (authError) {
      // Handle specific authentication errors
      if (authError.message.includes('Invalid login credentials') || 
          authError.message.includes('Email not confirmed')) {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        )
      }
      throw new Error(`Authentication failed: ${authError.message}`)
    }

    if (!authData.user || !authData.session) {
      throw new Error('Login failed - no user or session returned')
    }

    // Return session token and user info
    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        name: authData.user.user_metadata?.name || null
      },
      session: {
        access_token: authData.session.access_token,
        expires_at: authData.session.expires_at
      }
    }, {
      headers: {
        'Set-Cookie': `sb-access-token=${authData.session.access_token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${authData.session.expires_in}`
      }
    })

  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to login. Please try again.' },
      { status: 500 }
    )
  }
}

