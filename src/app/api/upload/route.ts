import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { corsHeaders } from '@/lib/cors'

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
    const title = formData.get('title') as string
    const authorName = formData.get('authorName') as string
    const email = formData.get('email') as string
    const mobileNumber = formData.get('mobileNumber') as string
    const paymentScreenshot = formData.get('paymentScreenshot') as File

    if (!file || !title || !authorName || !email || !mobileNumber) {
      return NextResponse.json(
        { error: 'File, title, author name, email, and mobile number are required' },
        { status: 400, headers: corsHeaders(request.headers.get('origin')) }
      )
    }

    if (!file.name.endsWith('.docx')) {
      return NextResponse.json(
        { error: 'Only DOCX files are allowed' },
        { status: 400, headers: corsHeaders(request.headers.get('origin')) }
      )
    }

    // Validate payment screenshot if provided
    if (paymentScreenshot && paymentScreenshot.size > 0) {
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg']
      if (!allowedTypes.includes(paymentScreenshot.type)) {
        return NextResponse.json(
          { error: 'Payment screenshot must be PNG or JPG' },
          { status: 400, headers: corsHeaders(request.headers.get('origin')) }
        )
      }
    }

    // Convert file to buffer
    const fileBuffer = await file.arrayBuffer()
    const fileName = `${Date.now()}-${file.name}`

    // Upload DOCX to Supabase Storage
    const { error: docxError } = await supabaseAdmin.storage
      .from('documents')
      .upload(fileName, Buffer.from(fileBuffer), {
        contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      })

    if (docxError) {
      throw new Error(`Failed to upload DOCX: ${docxError.message}`)
    }

    // Get public URL for the uploaded file
    const { data: docxUrl } = supabaseAdmin.storage
      .from('documents')
      .getPublicUrl(fileName)

    // Handle payment screenshot upload if provided
    let paymentScreenshotUrl = null
    if (paymentScreenshot && paymentScreenshot.size > 0) {
      const paymentBuffer = await paymentScreenshot.arrayBuffer()
      const paymentFileName = `payment-${Date.now()}-${paymentScreenshot.name}`
      
      const { error: paymentError } = await supabaseAdmin.storage
        .from('payments')
        .upload(paymentFileName, Buffer.from(paymentBuffer), {
          contentType: paymentScreenshot.type
        })

      if (paymentError) {
        throw new Error(`Failed to upload payment screenshot: ${paymentError.message}`)
      }

      const { data: paymentUrl } = supabaseAdmin.storage
        .from('payments')
        .getPublicUrl(paymentFileName)
      
      paymentScreenshotUrl = paymentUrl.publicUrl
    }

    // Create or find user
    let userId
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
      userId = existingUser.id
    } else {
      const { data: newUser, error: userError } = await supabaseAdmin
        .from('users')
        .insert({
          email,
          mobile_number: mobileNumber,
          author_name: authorName
        })
        .select('id')
        .single()

      if (userError) {
        throw new Error(`Failed to create user: ${userError.message}`)
      }
      userId = newUser.id
    }

    // Save article to database
    const { data: article, error: dbError } = await supabaseAdmin
      .from('articles')
      .insert({
        user_id: userId,
        title,
        author_name: authorName,
        docx_url: docxUrl.publicUrl,
        payment_screenshot_url: paymentScreenshotUrl,
        pdf_url: null, // No PDF conversion
        status: 'pending'
      })
      .select()
      .single()

    if (dbError) {
      throw new Error(`Failed to save article: ${dbError.message}`)
    }

    return NextResponse.json(
      {
        success: true,
        article: {
          id: article.id,
          title: article.title,
          status: article.status,
          created_at: article.created_at
        }
      },
      { headers: corsHeaders(request.headers.get('origin')) }
    )

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to process upload' },
      { status: 500, headers: corsHeaders(request.headers.get('origin')) }
    )
  }
}
