# 🧪 Backend Testing Guide

## Quick Start

### 1. Set up Supabase (5 minutes)
1. Go to [supabase.com](https://supabase.com) and create a project
2. Copy your Project URL and API keys from Settings → API
3. Create `.env.local` file with your keys (see `env-template.txt`)
4. Run the SQL schema from `supabase-schema.sql` in Supabase SQL Editor

### 2. Start the server
```bash
npm run dev
```

### 3. Test the backend
Open [http://localhost:3000](http://localhost:3000) - you'll see a test dashboard!

## Manual API Testing

### Test 1: Basic Connection
```bash
curl http://localhost:3000/api/articles
```
**Expected:** `{"articles":[]}` (empty array is fine)

### Test 2: Admin Endpoint
```bash
curl http://localhost:3000/api/admin/approve
```
**Expected:** `{"articles":[]}` (empty array is fine)

### Test 3: File Upload (you need a test.docx file)
```bash
curl -X POST http://localhost:3000/api/upload \
  -F "title=Test Paper" \
  -F "file=@test.docx"
```
**Expected:** Success response with article ID

### Test 4: Approve Article (after upload)
```bash
curl -X PATCH http://localhost:3000/api/admin/approve \
  -H "Content-Type: application/json" \
  -d '{"id":"ARTICLE_ID","status":"approved"}'
```

## Automated Testing

Run the test script:
```bash
node test-api.js
```

## What to Add to Supabase

### Required Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLI_SUPABASE_ANON_KEY=eyJ... (anon public key)
SUPABASE_SERVICE_ROLE_KEY=eyJ... (service role key - keep secret!)
```

### Database Schema
Run this SQL in your Supabase SQL Editor:
```sql
-- Create articles table
CREATE TABLE articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  docx_url TEXT,
  pdf_url TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('pdfs', 'pdfs', true);

-- Set up security policies
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to approved articles" ON articles FOR SELECT USING (status = 'approved');
CREATE POLICY "Allow service role to manage all articles" ON articles FOR ALL USING (auth.role() = 'service_role');
```

## Success Indicators

✅ **Backend Working:**
- Home page shows "Backend is working!"
- API endpoints return JSON responses
- No console errors

✅ **Database Connected:**
- Articles endpoint returns data (even if empty)
- No Supabase connection errors

✅ **File Upload Working:**
- Upload returns success with article ID
- Files appear in Supabase Storage
- PDF conversion works

✅ **Admin System Working:**
- Admin endpoint shows all articles
- Status updates work
- Articles can be approved/rejected

## Troubleshooting

**"Backend connection failed"**
- Check your `.env.local` file
- Verify Supabase URL and keys
- Make sure Supabase project is active

**"Database error"**
- Run the SQL schema in Supabase
- Check if articles table exists
- Verify RLS policies are set

**"Upload failed"**
- Check service role key
- Verify storage buckets exist
- Test with a small DOCX file

## Next Steps for Production

1. **Frontend:** Your frontend developer can use these API endpoints
2. **Authentication:** Add user authentication if needed
3. **File Limits:** Configure file size limits
4. **Email Notifications:** Add email alerts for approvals
5. **Deployment:** Deploy to Vercel with environment variables
