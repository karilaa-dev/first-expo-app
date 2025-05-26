import { createClient } from '@supabase/supabase-js';

// Replace with your Supabase Project URL
const supabaseUrl = 'https://oegrkivussdgcdbdrebu.supabase.co';
// Replace with your Supabase Anon Key
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lZ3JraXZ1c3NkZ2NkYmRyZWJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyNzM0MDUsImV4cCI6MjA2Mjg0OTQwNX0.kU9cG5JcmW60o_PrHZCqSduG3xMrZ4C745MsCrvuqz4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
