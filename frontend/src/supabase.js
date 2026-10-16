import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://jwwxipttvvmulsopcxfa.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3d3hpcHR0dnZtdWxzb3BjeGZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc5MzE4MzUsImV4cCI6MjEwMzUwNzgzNX0.G3b7Fey8cQsFud0Myz1l3e89PYHjPe1evUF5D8Yir80'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
