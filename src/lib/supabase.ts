import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://siqczkwddpwruwhwwzzh.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpcWN6a3dkZHB3cnV3aHd3enpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4ODM3NTAsImV4cCI6MjA3MTQ1OTc1MH0.OZpGLU9ZS7rk0o9rVYMEM6tofqMTUpPxgacuSAxXArc'

export const supabase = createClient(supabaseUrl, supabaseAnonKey);