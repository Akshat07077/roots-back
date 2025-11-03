import { NextResponse } from 'next/server'

export async function POST() {
  try {
    // Clear the session cookie
    return NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    }, {
      headers: {
        'Set-Cookie': 'sb-access-token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0'
      }
    })

  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Failed to logout. Please try again.' },
      { status: 500 }
    )
  }
}

