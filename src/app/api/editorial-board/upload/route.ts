import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { corsHeaders } from '@/lib/cors'

// API endpoint to upload profile pictures for editorial board members
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders(request.headers.get('origin')),
  })
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400, headers: corsHeaders(request.headers.get('origin')) }
      )
    }

    // Validate file type (only images)
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PNG, JPG, JPEG, and WEBP images are allowed.' },
        { status: 400, headers: corsHeaders(request.headers.get('origin')) }
      )
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 5MB.' },
        { status: 400, headers: corsHeaders(request.headers.get('origin')) }
      )
    }

    // Convert file to buffer
    const fileBuffer = await file.arrayBuffer()
    const fileName = `editorial-profile-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`

    // Upload to Supabase Storage (create 'editorial-photos' bucket if needed, or use existing)
    // First, try to upload to a new bucket or use existing storage
    const { error: uploadError } = await supabaseAdmin.storage
      .from('editorial-photos')
      .upload(fileName, Buffer.from(fileBuffer), {
        contentType: file.type,
        upsert: false
      })

    // If bucket doesn't exist, try 'payments' bucket or create error message
    if (uploadError) {
      // Try alternative bucket or provide setup instructions
      return NextResponse.json(
        { 
          error: 'Failed to upload file. Please ensure "editorial-photos" bucket exists in Supabase Storage.',
          details: uploadError.message
        },
        { status: 500, headers: corsHeaders(request.headers.get('origin')) }
      )
    }

    // Get public URL for the uploaded file
    const { data: urlData } = supabaseAdmin.storage
      .from('editorial-photos')
      .getPublicUrl(fileName)

    return NextResponse.json(
      {
        success: true,
        photo_url: urlData.publicUrl,
        message: 'Profile picture uploaded successfully'
      },
      { headers: corsHeaders(request.headers.get('origin')) }
    )

  } catch (error) {
    console.error('Profile picture upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload profile picture. Please try again.' },
      { status: 500, headers: corsHeaders(request.headers.get('origin')) }
    )
  }
}

