import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://knfmbyvvsefdrdmyjeqb.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtuZm1ieXZ2c2VmZHJkbXlqZXFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4NTM2MTQsImV4cCI6MjA3NjQyOTYxNH0.Lwu2ALfKRAPk_T9SauTqFE24dSKi_uDmgYyw9kFCG48'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// For server-side operations that require service role
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtuZm1ieXZ2c2VmZHJkbXlqZXFiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDg1MzYxNCwiZXhwIjoyMDc2NDI5NjE0fQ.xlsELw9fDJbZCKjX0HgPV-evxEoLsxjpzfuNE_G4lMQ'
)
