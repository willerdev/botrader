import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xkkqkghlnfhuczwiskpi.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhra3FrZ2hsbmZodWN6d2lza3BpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMwMTQxOTgsImV4cCI6MjA0ODU5MDE5OH0.lCudbi_-8zthBkFQ0os_Rg-NXT_4tSfwlhGQzaOtCm0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)