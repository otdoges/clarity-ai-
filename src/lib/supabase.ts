import { createClient } from '@supabase/supabase-js';

// Try both prefixed and non-prefixed environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and/or anon key not set in .env file');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 