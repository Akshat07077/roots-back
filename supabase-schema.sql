-- Create users table for tracking submissions
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  mobile_number VARCHAR(20) NOT NULL,
  author_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create articles table with user reference
CREATE TABLE articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  author_name VARCHAR(255) NOT NULL,
  docx_url TEXT NOT NULL,
  payment_screenshot_url TEXT,
  pdf_url TEXT, -- Optional, not used
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage buckets for files
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('pdfs', 'pdfs', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('payments', 'payments', false);

-- Create storage policies
CREATE POLICY "Allow public read access to PDFs" ON storage.objects
  FOR SELECT USING (bucket_id = 'pdfs');

CREATE POLICY "Allow authenticated users to upload documents" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'documents' AND auth.role() = 'authenticated');

CREATE POLICY "Allow service role to manage all files" ON storage.objects
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow service role to manage payment screenshots" ON storage.objects
  FOR ALL USING (bucket_id = 'payments' AND auth.role() = 'service_role');

-- Create RLS policies for articles table
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Allow public read access to approved articles
CREATE POLICY "Allow public read access to approved articles" ON articles
  FOR SELECT USING (status = 'approved');

-- Allow authenticated users to insert articles
CREATE POLICY "Allow authenticated users to insert articles" ON articles
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow service role to manage all articles
CREATE POLICY "Allow service role to manage all articles" ON articles
  FOR ALL USING (auth.role() = 'service_role');

-- Enable RLS for users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow service role to manage all users
CREATE POLICY "Allow service role to manage all users" ON users
  FOR ALL USING (auth.role() = 'service_role');

-- Allow public read access to users (for admin to see contact info)
CREATE POLICY "Allow public read access to users" ON users
  FOR SELECT USING (true);
