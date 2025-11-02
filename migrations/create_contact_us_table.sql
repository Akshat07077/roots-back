-- Migration: Create or update contact_us table with simplified schema
-- Only includes: name, email, and message fields

-- Drop existing table if it exists (use with caution in production)
-- DROP TABLE IF EXISTS contact_us CASCADE;

-- Create contact_us table for contact form submissions
CREATE TABLE IF NOT EXISTS contact_us (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- If table exists with old schema, alter it to remove unnecessary columns
-- Run these only if you need to migrate existing data
-- ALTER TABLE contact_us DROP COLUMN IF EXISTS subject;
-- ALTER TABLE contact_us DROP COLUMN IF EXISTS phone;
-- ALTER TABLE contact_us DROP COLUMN IF EXISTS organization;

-- Enable RLS for contact_us table
ALTER TABLE contact_us ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Allow public to insert contact submissions" ON contact_us;
DROP POLICY IF EXISTS "Allow service role to manage contact submissions" ON contact_us;

-- Allow public to insert contact form submissions
CREATE POLICY "Allow public to insert contact submissions" ON contact_us
  FOR INSERT WITH CHECK (true);

-- Allow service role to manage all contact submissions
CREATE POLICY "Allow service role to manage contact submissions" ON contact_us
  FOR ALL USING (auth.role() = 'service_role');

