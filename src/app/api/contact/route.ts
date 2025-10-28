import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message, phone, organization } = body

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Name, email, subject, and message are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      )
    }

    // Save contact form submission to database
    const { data: contact, error } = await supabaseAdmin
      .from('contact_us')
      .insert({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        subject: subject.trim(),
        message: message.trim(),
        phone: phone?.trim() || null,
        organization: organization?.trim() || null
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to save contact submission: ${error.message}`)
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you for your message! We will get back to you soon.',
      contact: {
        id: contact.id,
        name: contact.name,
        email: contact.email,
        subject: contact.subject,
        created_at: contact.created_at
      }
    })

  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to submit contact form. Please try again.' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const { data: contacts, error } = await supabaseAdmin
      .from('contact_us')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch contact submissions: ${error.message}`)
    }

    return NextResponse.json({ contacts })
  } catch (error) {
    console.error('Contact fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contact submissions' },
      { status: 500 }
    )
  }
}
