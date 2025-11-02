-- Migration: Create editorial-photos storage bucket
-- Run this in your Supabase SQL Editor

-- Create the storage bucket for editorial board profile pictures
INSERT INTO storage.buckets (id, name, public)
VALUES ('editorial-photos', 'editorial-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to editorial photos
CREATE POLICY "Allow public read access to editorial photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'editorial-photos');

-- Allow service role to manage all editorial photos
CREATE POLICY "Allow service role to manage editorial photos" ON storage.objects
  FOR ALL USING (bucket_id = 'editorial-photos' AND auth.role() = 'service_role');

