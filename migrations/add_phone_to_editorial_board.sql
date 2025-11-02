-- Migration: Add phone_number field to editorial_board table
-- Run this in your Supabase SQL Editor

ALTER TABLE editorial_board 
ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20);

-- Add comment to the column
COMMENT ON COLUMN editorial_board.phone_number IS 'Contact phone number for editorial board member';

