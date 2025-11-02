# 🔄 Migration Guide - How to Run Database Migrations

This guide explains how to run the SQL migration files in your Supabase database.

## 📋 Prerequisites

1. Access to your Supabase project dashboard
2. SQL Editor permissions in Supabase

## 🚀 Step-by-Step Instructions

### Step 1: Open Supabase Dashboard

1. Go to [https://supabase.com](https://supabase.com)
2. Log in to your account
3. Select your project: **academic-archive** (or your project name)

### Step 2: Open SQL Editor

1. In the left sidebar, click on **"SQL Editor"** (or press `Alt + S`)
2. Click **"New query"** button at the top

### Step 3: Run the First Migration (Add Phone Number)

1. Copy the entire contents of `migrations/add_phone_to_editorial_board.sql`
2. Paste it into the SQL Editor
3. Click the **"Run"** button (or press `Ctrl + Enter` / `Cmd + Enter`)
4. You should see a success message: "Success. No rows returned"

**Migration File Content:**
```sql
-- Migration: Add phone_number field to editorial_board table
ALTER TABLE editorial_board 
ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20);

COMMENT ON COLUMN editorial_board.phone_number IS 'Contact phone number for editorial board member';
```

### Step 4: Run the Second Migration (Create Storage Bucket)

1. Copy the entire contents of `migrations/create_editorial_photos_bucket.sql`
2. Paste it into a **new query** in the SQL Editor (or clear the previous one)
3. Click **"Run"** button
4. You should see a success message

**Migration File Content:**
```sql
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
```

### Step 5: Verify the Migrations

1. **Verify phone_number column:**
   - Go to **Table Editor** in the left sidebar
   - Select `editorial_board` table
   - Check that `phone_number` column exists

2. **Verify storage bucket:**
   - Go to **Storage** in the left sidebar
   - You should see `editorial-photos` bucket listed
   - It should be marked as **Public**

## ✅ Migration Complete!

After running both migrations, you can now:
- ✅ Add phone numbers to editorial board members
- ✅ Upload profile pictures to the `editorial-photos` bucket
- ✅ Use the full editorial board management in the admin panel

## 🐛 Troubleshooting

### Error: "column already exists"
- This means the `phone_number` column was already added
- The migration uses `IF NOT EXISTS`, so it's safe to run again
- You can ignore this message

### Error: "bucket already exists"
- The bucket might already exist from a previous run
- The migration uses `ON CONFLICT DO NOTHING`, so it's safe
- Check Storage section to verify the bucket exists

### Error: "policy already exists"
- The storage policies might already be created
- Drop the existing policy first, then run the migration again:
```sql
DROP POLICY IF EXISTS "Allow public read access to editorial photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow service role to manage editorial photos" ON storage.objects;
```
- Then run the migration file again

## 📝 Quick Copy-Paste Commands

### Migration 1: Add Phone Number
```sql
ALTER TABLE editorial_board 
ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20);

COMMENT ON COLUMN editorial_board.phone_number IS 'Contact phone number for editorial board member';
```

### Migration 2: Create Storage Bucket
```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('editorial-photos', 'editorial-photos', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Allow public read access to editorial photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'editorial-photos');

CREATE POLICY "Allow service role to manage editorial photos" ON storage.objects
  FOR ALL USING (bucket_id = 'editorial-photos' AND auth.role() = 'service_role');
```

---

**Note:** If you're setting up the database for the first time, run the complete `supabase-schema.sql` file instead, which includes all migrations.

