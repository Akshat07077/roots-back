# Quick Setup Guide

## 1. Install Dependencies
```bash
npm install
```

## 2. Set up Supabase

### Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for the project to be ready

### Get API Keys
1. Go to Settings > API
2. Copy your Project URL and anon public key
3. Copy your service_role key (keep this secret!)

### Set up Environment Variables
Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

### Set up Database
1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase-schema.sql`
4. Click "Run" to execute the SQL

## 3. Run the Application
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 4. Test the System
1. Go to `/submit` to upload a test DOCX file
2. Go to `/admin` to review and approve the submission
3. Go back to `/` to see the approved paper

## Deployment to Vercel
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy!

## Troubleshooting

### Common Issues
- **"Failed to fetch articles"**: Check your Supabase URL and keys
- **"Failed to upload"**: Check your service role key
- **Database errors**: Make sure you ran the SQL schema setup

### File Upload Issues
- Only DOCX files are accepted
- Maximum file size is limited by Vercel (10MB for free tier)
- Check browser console for detailed error messages
