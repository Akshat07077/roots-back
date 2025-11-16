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
    const { data: members, error } = await supabaseAdmin
      .from('editorial_board')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true })

    if (error) {
      throw new Error(`Failed to fetch editorial board members: ${error.message}`)
    }

    return NextResponse.json(
      { members },
      { headers: corsHeaders(request.headers.get('origin')) }
    )
  } catch (error) {
    console.error('Editorial board fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch editorial board members' },
      { status: 500, headers: corsHeaders(request.headers.get('origin')) }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      name, 
      title, 
      affiliation, 
      email, 
      phone_number,
      bio, 
      photo_url, 
      order_index = 0 
    } = body

    // Validate required fields
    if (!name || !title) {
      return NextResponse.json(
        { error: 'Name and title (profession) are required' },
        { status: 400, headers: corsHeaders(request.headers.get('origin')) }
      )
    }

    // Validate email format if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { error: 'Please provide a valid email address' },
          { status: 400, headers: corsHeaders(request.headers.get('origin')) }
        )
      }
    }

    // Save editorial board member to database
    const { data: member, error } = await supabaseAdmin
      .from('editorial_board')
      .insert({
        name: name.trim(),
        title: title.trim(), // This is the profession
        affiliation: affiliation.trim(),
        email: email?.trim().toLowerCase() || null,
        phone_number: phone_number?.trim() || null,
        bio: bio?.trim() || null,
        photo_url: photo_url?.trim() || null,
        order_index: order_index || 0,
        is_active: true
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to save editorial board member: ${error.message}`)
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Editorial board member added successfully',
        member
      },
      { headers: corsHeaders(request.headers.get('origin')) }
    )

  } catch (error) {
    console.error('Editorial board creation error:', error)
    return NextResponse.json(
      { error: 'Failed to add editorial board member. Please try again.' },
      { status: 500, headers: corsHeaders(request.headers.get('origin')) }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      id,
      name, 
      title, 
      affiliation, 
      email,
      phone_number,
      bio, 
      photo_url, 
      order_index,
      is_active = true
    } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Member ID is required for update' },
        { status: 400, headers: corsHeaders(request.headers.get('origin')) }
      )
    }

    // Validate required fields
    if (!name || !title) {
      return NextResponse.json(
        { error: 'Name and title are required' },
        { status: 400, headers: corsHeaders(request.headers.get('origin')) }
      )
    }

    // Validate email format if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { error: 'Please provide a valid email address' },
          { status: 400, headers: corsHeaders(request.headers.get('origin')) }
        )
      }
    }

    // Update editorial board member
    const { data: member, error } = await supabaseAdmin
      .from('editorial_board')
      .update({
        name: name.trim(),
        title: title.trim(),
        affiliation: affiliation.trim(),
        email: email?.trim().toLowerCase() || null,
        phone_number: phone_number?.trim() || null,
        bio: bio?.trim() || null,
        photo_url: photo_url?.trim() || null,
        order_index: order_index || 0,
        is_active: is_active,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update editorial board member: ${error.message}`)
    }

    if (!member) {
      return NextResponse.json(
        { error: 'Editorial board member not found' },
        { status: 404, headers: corsHeaders(request.headers.get('origin')) }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Editorial board member updated successfully',
        member
      },
      { headers: corsHeaders(request.headers.get('origin')) }
    )

  } catch (error) {
    console.error('Editorial board update error:', error)
    return NextResponse.json(
      { error: 'Failed to update editorial board member. Please try again.' },
      { status: 500, headers: corsHeaders(request.headers.get('origin')) }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Member ID is required for deletion' },
        { status: 400, headers: corsHeaders(request.headers.get('origin')) }
      )
    }

    // Soft delete by setting is_active to false
    const { data: member, error } = await supabaseAdmin
      .from('editorial_board')
      .update({
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to delete editorial board member: ${error.message}`)
    }

    if (!member) {
      return NextResponse.json(
        { error: 'Editorial board member not found' },
        { status: 404, headers: corsHeaders(request.headers.get('origin')) }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Editorial board member deleted successfully'
      },
      { headers: corsHeaders(request.headers.get('origin')) }
    )

  } catch (error) {
    console.error('Editorial board deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete editorial board member. Please try again.' },
      { status: 500, headers: corsHeaders(request.headers.get('origin')) }
    )
  }
}
