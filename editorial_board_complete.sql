-- Complete Editorial Board Table Schema
-- Run this in your Supabase SQL Editor

-- Create editorial_board table for editorial board members
CREATE TABLE IF NOT EXISTS editorial_board (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  affiliation VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone_number VARCHAR(20),
  bio TEXT,
  photo_url TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for editorial_board table
ALTER TABLE editorial_board ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active editorial board members
DROP POLICY IF EXISTS "Allow public read access to active editorial board" ON editorial_board;
CREATE POLICY "Allow public read access to active editorial board" ON editorial_board
  FOR SELECT USING (is_active = true);

-- Allow service role to manage all editorial board members
DROP POLICY IF EXISTS "Allow service role to manage editorial board" ON editorial_board;
CREATE POLICY "Allow service role to manage editorial board" ON editorial_board
  FOR ALL USING (auth.role() = 'service_role');

-- Create storage bucket for editorial photos (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('editorial-photos', 'editorial-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for editorial photos
DROP POLICY IF EXISTS "Allow public read access to editorial photos" ON storage.objects;
CREATE POLICY "Allow public read access to editorial photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'editorial-photos');

DROP POLICY IF EXISTS "Allow service role to manage editorial photos" ON storage.objects;
CREATE POLICY "Allow service role to manage editorial photos" ON storage.objects
  FOR ALL USING (bucket_id = 'editorial-photos' AND auth.role() = 'service_role');

