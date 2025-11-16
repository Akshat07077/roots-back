import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { corsHeaders } from '@/lib/cors'

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders(request.headers.get('origin')),
  })
}

// GET /api/editorial-board/[id] - Get single member
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { data: member, error } = await supabaseAdmin
      .from('editorial_board')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single()

    if (error || !member) {
      return NextResponse.json(
        { error: 'Editorial board member not found' },
        { status: 404, headers: corsHeaders(request.headers.get('origin')) }
      )
    }

    return NextResponse.json(
      { member },
      { headers: corsHeaders(request.headers.get('origin')) }
    )
  } catch (error) {
    console.error('Editorial board fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch editorial board member' },
      { status: 500, headers: corsHeaders(request.headers.get('origin')) }
    )
  }
}

// PATCH /api/editorial-board/[id] - Update member (supports older frontend)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const {
      name,
      title,
      affiliation,
      email,
      phone_number,
      bio,
      photo_url,
      order_index,
      is_active
    } = body

    // Validate required fields if provided
    if (name !== undefined && !name.trim()) {
      return NextResponse.json(
        { error: 'Name cannot be empty' },
        { status: 400, headers: corsHeaders(request.headers.get('origin')) }
      )
    }
    if (title !== undefined && !title.trim()) {
      return NextResponse.json(
        { error: 'Title cannot be empty' },
        { status: 400, headers: corsHeaders(request.headers.get('origin')) }
      )
    }

    // Validate email format if provided
    if (email && email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { error: 'Please provide a valid email address' },
          { status: 400, headers: corsHeaders(request.headers.get('origin')) }
        )
      }
    }

    // Build update data object (only include fields that are provided)
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString()
    }

    if (name !== undefined) updateData.name = name.trim()
    if (title !== undefined) updateData.title = title.trim()
    if (affiliation !== undefined) updateData.affiliation = affiliation.trim()
    if (email !== undefined) updateData.email = email?.trim().toLowerCase() || null
    if (phone_number !== undefined) updateData.phone_number = phone_number?.trim() || null
    if (bio !== undefined) updateData.bio = bio?.trim() || null
    if (photo_url !== undefined) updateData.photo_url = photo_url?.trim() || null
    if (order_index !== undefined) updateData.order_index = order_index
    if (is_active !== undefined) updateData.is_active = is_active

    // Update the member
    const { data: member, error } = await supabaseAdmin
      .from('editorial_board')
      .update(updateData)
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

// PUT /api/editorial-board/[id] - Update member (alternative method)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Delegate to PATCH handler
  return PATCH(request, { params })
}

// DELETE /api/editorial-board/[id] - Delete member (supports older frontend)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

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

