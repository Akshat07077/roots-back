-- Add publication fields to articles table
-- Volume refers to year, Issue refers to title

ALTER TABLE articles 
ADD COLUMN IF NOT EXISTS volume VARCHAR(50),
ADD COLUMN IF NOT EXISTS issue VARCHAR(255),
ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT false;

-- Update RLS policy to allow public read access to published articles
DROP POLICY IF EXISTS "Allow public read access to approved articles" ON articles;

CREATE POLICY "Allow public read access to published articles" ON articles
  FOR SELECT USING (is_published = true);

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_articles_is_published ON articles(is_published);
CREATE INDEX IF NOT EXISTS idx_articles_volume_issue ON articles(volume, issue);

