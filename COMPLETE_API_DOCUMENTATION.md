# 📚 Complete API Documentation - Academic Archive

## 🎯 Project Overview

A Next.js academic paper archive system with authentication, file uploads, admin approval, contact forms, and editorial board management. Uses Supabase for database and storage.

---

## 🔧 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Authentication**: Supabase Auth
- **Language**: TypeScript

---

## 📦 Required Setup

### Environment Variables (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### Supabase Client Setup
```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey)
```

---

## 🔐 Authentication APIs

### 1. Register User
**POST** `/api/auth/register`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe" // Optional
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Account created successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Implementation:**
```typescript
// src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  const { email, password, name } = await request.json()
  
  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
  }
  
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: email.trim().toLowerCase(),
    password,
    email_confirm: true,
    user_metadata: { name: name?.trim() || null }
  })
  
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  
  return NextResponse.json({
    success: true,
    user: { id: data.user.id, email: data.user.email, name: data.user.user_metadata?.name }
  })
}
```

---

### 2. Login
**POST** `/api/auth/login`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  },
  "session": {
    "access_token": "jwt-token",
    "expires_at": 1234567890
  }
}
```

**Implementation:**
```typescript
// src/app/api/auth/login/route.ts
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  const { email, password } = await request.json()
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password
  })
  
  if (error) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  
  return NextResponse.json({
    success: true,
    user: { id: data.user.id, email: data.user.email },
    session: { access_token: data.session.access_token, expires_at: data.session.expires_at }
  })
}
```

---

### 3. Logout
**POST** `/api/auth/logout`

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 4. Get Current User
**GET** `/api/auth/me`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

---

## 📄 Articles APIs

### 1. Get Approved Articles
**GET** `/api/articles`

**Response (200):**
```json
{
  "articles": [
    {
      "id": "uuid",
      "title": "Paper Title",
      "author_name": "Author Name",
      "docx_url": "https://storage-url/docx",
      "status": "approved",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**Implementation:**
```typescript
// src/app/api/articles/route.ts
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('articles')
    .select('*')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
  
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ articles: data || [] })
}
```

---

### 2. Upload Paper
**POST** `/api/upload`

**Request (FormData):**
- `title` (string): Paper title
- `authorName` (string): Author name
- `email` (string): Author email
- `mobileNumber` (string): Mobile number
- `file` (File): DOCX file
- `paymentScreenshot` (File, optional): Payment proof image

**Response (200):**
```json
{
  "success": true,
  "article": {
    "id": "uuid",
    "title": "Paper Title",
    "author_name": "Author Name",
    "status": "pending",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Implementation:**
```typescript
// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const file = formData.get('file') as File
  const title = formData.get('title') as string
  
  // Upload file to Supabase Storage
  const fileName = `${Date.now()}-${file.name}`
  const fileBuffer = await file.arrayBuffer()
  
  const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
    .from('documents')
    .upload(fileName, Buffer.from(fileBuffer), {
      contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    })
  
  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }
  
  // Get public URL
  const { data: urlData } = supabaseAdmin.storage
    .from('documents')
    .getPublicUrl(fileName)
  
  // Save to database
  const { data: article, error } = await supabaseAdmin
    .from('articles')
    .insert({
      title,
      author_name: formData.get('authorName') as string,
      docx_url: urlData.publicUrl,
      status: 'pending'
    })
    .select()
    .single()
  
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, article })
}
```

---

### 3. Admin: Get All Articles
**GET** `/api/admin/approve`

**Response (200):**
```json
{
  "articles": [
    {
      "id": "uuid",
      "title": "Paper Title",
      "status": "pending",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### 4. Admin: Approve/Reject Article
**PATCH** `/api/admin/approve`

**Request:**
```json
{
  "id": "article-uuid",
  "status": "approved" // or "rejected"
}
```

**Response (200):**
```json
{
  "success": true,
  "article": {
    "id": "uuid",
    "status": "approved",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## 📧 Contact API

### Submit Contact Form
**POST** `/api/contact`

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Your message here"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Thank you for your message!",
  "contact": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Implementation:**
```typescript
// src/app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  const { name, email, message } = await request.json()
  
  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 })
  }
  
  const { data, error } = await supabaseAdmin
    .from('contact_us')
    .insert({ name: name.trim(), email: email.trim().toLowerCase(), message: message.trim() })
    .select()
    .single()
  
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  
  return NextResponse.json({ success: true, contact: data })
}
```

---

## 👥 Editorial Board API

### 1. Get Editorial Board Members
**GET** `/api/editorial-board`

**Response (200):**
```json
{
  "members": [
    {
      "id": "uuid",
      "name": "Dr. Jane Smith",
      "title": "Professor",
      "affiliation": "MIT",
      "email": "jane@mit.edu",
      "phone_number": "+1234567890",
      "photo_url": "https://storage-url/photo.jpg",
      "bio": "Expert in...",
      "is_active": true
    }
  ]
}
```

---

### 2. Add Editorial Board Member
**POST** `/api/editorial-board`

**Request:**
```json
{
  "name": "Dr. Jane Smith",
  "title": "Professor",
  "affiliation": "MIT", // Optional
  "email": "jane@mit.edu", // Optional
  "phone_number": "+1234567890", // Optional
  "photo_url": "https://storage-url/photo.jpg", // Optional
  "bio": "Expert biography" // Optional
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Editorial board member added successfully",
  "member": { /* member object */ }
}
```

---

### 3. Upload Profile Picture
**POST** `/api/editorial-board/upload`

**Request (FormData):**
- `file` (File): Image file (PNG, JPG, JPEG, WEBP, max 5MB)

**Response (200):**
```json
{
  "success": true,
  "photo_url": "https://storage-url/editorial-profile-123.jpg"
}
```

---

## 🗄️ Database Schema

### Tables

#### 1. users
```sql
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  mobile_number VARCHAR(20) NOT NULL,
  author_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 2. articles
```sql
CREATE TABLE articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  author_name VARCHAR(255) NOT NULL,
  docx_url TEXT NOT NULL,
  payment_screenshot_url TEXT,
  pdf_url TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 3. contact_us
```sql
CREATE TABLE contact_us (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 4. editorial_board
```sql
CREATE TABLE editorial_board (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  affiliation VARCHAR(255),
  email VARCHAR(255),
  phone_number VARCHAR(20),
  bio TEXT,
  photo_url TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Storage Buckets

1. **documents** - Private bucket for DOCX files
2. **editorial-photos** - Public bucket for profile pictures
3. **payments** - Private bucket for payment screenshots

---

## 🔒 Security & RLS Policies

### Articles Table
```sql
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to approved articles" ON articles
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Allow service role to manage all articles" ON articles
  FOR ALL USING (auth.role() = 'service_role');
```

### Editorial Board
```sql
ALTER TABLE editorial_board ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to active editorial board" ON editorial_board
  FOR SELECT USING (is_active = true);

CREATE POLICY "Allow service role to manage editorial board" ON editorial_board
  FOR ALL USING (auth.role() = 'service_role');
```

---

## 📝 Key Implementation Patterns

### 1. File Upload Pattern
```typescript
// Upload file to Supabase Storage
const fileBuffer = await file.arrayBuffer()
const fileName = `${Date.now()}-${file.name}`

const { data, error } = await supabaseAdmin.storage
  .from('bucket-name')
  .upload(fileName, Buffer.from(fileBuffer), {
    contentType: file.type
  })

// Get public URL
const { data: urlData } = supabaseAdmin.storage
  .from('bucket-name')
  .getPublicUrl(fileName)
```

### 2. Database Insert Pattern
```typescript
const { data, error } = await supabaseAdmin
  .from('table_name')
  .insert({ field1: value1, field2: value2 })
  .select()
  .single()

if (error) {
  return NextResponse.json({ error: error.message }, { status: 500 })
}
```

### 3. Error Handling Pattern
```typescript
try {
  // Operation
} catch (error: any) {
  console.error('Error:', error)
  return NextResponse.json(
    { error: error?.message || 'Operation failed' },
    { status: 500 }
  )
}
```

---

## 🚀 Quick Start Checklist

1. ✅ Create Supabase project
2. ✅ Set environment variables
3. ✅ Run database schema SQL
4. ✅ Create storage buckets
5. ✅ Set up RLS policies
6. ✅ Create API routes in `src/app/api/`
7. ✅ Test endpoints with Postman/curl

---

## 📚 API Summary Table

| Endpoint | Method | Purpose | Auth Required |
|----------|--------|---------|---------------|
| `/api/auth/register` | POST | Create account | No |
| `/api/auth/login` | POST | Sign in | No |
| `/api/auth/logout` | POST | Sign out | No |
| `/api/auth/me` | GET | Get current user | Yes |
| `/api/articles` | GET | Get approved articles | No |
| `/api/upload` | POST | Upload paper | No |
| `/api/admin/approve` | GET | Get all articles | No |
| `/api/admin/approve` | PATCH | Approve/reject | No |
| `/api/contact` | POST | Submit contact form | No |
| `/api/editorial-board` | GET | Get members | No |
| `/api/editorial-board` | POST | Add member | No |
| `/api/editorial-board/upload` | POST | Upload photo | No |

---

**Note**: All endpoints use `supabaseAdmin` for server-side operations to bypass RLS. For production, implement proper authentication middleware.

