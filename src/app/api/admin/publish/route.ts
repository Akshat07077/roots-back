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
    const volume = formData.get('volume') as string
    const issue = formData.get('issue') as string
    const pdfFile = formData.get('pdf') as File
    const articleId = formData.get('articleId') as string | null

    // Validate required fields
    if (!volume || !issue || !pdfFile) {
      return NextResponse.json(
        { error: 'Volume, Issue, and PDF file are required' },
        { status: 400, headers: corsHeaders(request.headers.get('origin')) }
      )
    }

    // Validate PDF file
    if (!pdfFile.name.endsWith('.pdf')) {
      return NextResponse.json(
        { error: 'Only PDF files are allowed' },
        { status: 400, headers: corsHeaders(request.headers.get('origin')) }
      )
    }

    if (pdfFile.size > 50 * 1024 * 1024) { // 50MB limit
      return NextResponse.json(
        { error: 'PDF file size must be less than 50MB' },
        { status: 400, headers: corsHeaders(request.headers.get('origin')) }
      )
    }

    // Convert file to buffer
    const fileBuffer = await pdfFile.arrayBuffer()
    const fileName = `published-${Date.now()}-${pdfFile.name}`

    // Upload PDF to Supabase Storage (pdfs bucket)
    const { error: pdfError } = await supabaseAdmin.storage
      .from('pdfs')
      .upload(fileName, Buffer.from(fileBuffer), {
        contentType: 'application/pdf'
      })

    if (pdfError) {
      throw new Error(`Failed to upload PDF: ${pdfError.message}`)
    }

    // Get public URL for the uploaded PDF
    const { data: pdfUrl } = supabaseAdmin.storage
      .from('pdfs')
      .getPublicUrl(fileName)

    // If articleId is provided, update existing article
    if (articleId) {
      const { data: article, error: updateError } = await supabaseAdmin
        .from('articles')
        .update({
          volume: volume.trim(),
          issue: issue.trim(),
          pdf_url: pdfUrl.publicUrl,
          is_published: true,
          status: 'approved', // Also mark as approved
          updated_at: new Date().toISOString()
        })
        .eq('id', articleId)
        .select()
        .single()

      if (updateError) {
        throw new Error(`Failed to update article: ${updateError.message}`)
      }

      return NextResponse.json(
        {
          success: true,
          message: 'Article published successfully',
          article: {
            id: article.id,
            title: article.title,
            volume: article.volume,
            issue: article.issue,
            pdf_url: article.pdf_url,
            is_published: article.is_published
          }
        },
        { headers: corsHeaders(request.headers.get('origin')) }
      )
    }

    // Otherwise, create a new published article entry
    // Note: This creates a standalone published article without linking to a submission
    const { data: article, error: insertError } = await supabaseAdmin
      .from('articles')
      .insert({
        volume: volume.trim(),
        issue: issue.trim(),
        title: issue.trim(), // Use issue as title if no articleId provided
        pdf_url: pdfUrl.publicUrl,
        docx_url: '', // Empty since this is a direct publication
        is_published: true,
        status: 'approved',
        author_name: 'Editorial Team' // Default author name
      })
      .select()
      .single()

    if (insertError) {
      throw new Error(`Failed to create published article: ${insertError.message}`)
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Article published successfully',
        article: {
          id: article.id,
          title: article.title,
          volume: article.volume,
          issue: article.issue,
          pdf_url: article.pdf_url,
          is_published: article.is_published
        }
      },
      { headers: corsHeaders(request.headers.get('origin')) }
    )

  } catch (error) {
    console.error('Publish error:', error)
    return NextResponse.json(
      { error: 'Failed to publish article' },
      { status: 500, headers: corsHeaders(request.headers.get('origin')) }
    )
  }
}

