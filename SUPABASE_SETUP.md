# Supabase Setup for Testing

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login and create a new project
3. Choose a name like "academic-archive"
4. Set a database password (save this!)
5. Choose a region close to you
6. Wait for the project to be created (2-3 minutes)

## Step 2: Get Your API Keys

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like: `https://your-project.supabase.co`)
   - **anon public** key (starts with `eyJ...`)
   - **service_role** key (starts with `eyJ...` - keep this secret!)

## Step 3: Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy and paste the entire contents of `supabase-schema.sql`
4. Click **Run** to execute

This will create:
- Articles table
- Storage buckets
- Security policies
- Row Level Security

## Step 4: Set Up Storage Buckets

1. Go to **Storage** in your Supabase dashboard
2. You should see two buckets: `documents` and `pdfs`
3. If not, the SQL script will create them

## Step 5: Configure Environment Variables

Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## Step 6: Test the Backend

Run these commands to test your API endpoints:

```bash
# Start the development server
npm run dev

# Test in another terminal or use Postman/curl
```

## API Testing Commands

### Test File Upload
```bash
curl -X POST http://localhost:3000/api/upload \
  -F "title=Test Paper" \
  -F "file=@/path/to/your/test.docx"
```

### Test Get Articles
```bash
curl http://localhost:3000/api/articles
```

### Test Admin Endpoints
```bash
# Get all articles for admin
curl http://localhost:3000/api/admin/approve

# Approve an article (replace ARTICLE_ID)
curl -X PATCH http://localhost:3000/api/admin/approve \
  -H "Content-Type: application/json" \
  -d '{"id":"ARTICLE_ID","status":"approved"}'
```

## Quick Test Checklist

- [ ] Supabase project created
- [ ] Database schema executed
- [ ] Environment variables set
- [ ] Development server running
- [ ] Upload endpoint working
- [ ] Articles endpoint returning data
- [ ] Admin endpoints functional

## Troubleshooting

**"Failed to connect to Supabase"**
- Check your URL and keys in `.env.local`
- Make sure you copied the keys correctly

**"Database error"**
- Make sure you ran the SQL schema
- Check if the articles table exists in your database

**"Storage error"**
- Verify storage buckets exist
- Check storage policies are set up correctly
