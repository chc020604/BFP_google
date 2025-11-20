
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types';

// User Provided Credentials
const SUPABASE_URL = 'https://xtlrjerjrrncvhxjihql.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0bHJqZXJqcnJuY3ZoeGppaHFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1NzM4NDksImV4cCI6MjA3OTE0OTg0OX0.Efq41ePU0E6QFWy1mFngrwzAYnz3J0dgLjF7RJYL20c';

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);

export const checkSupabaseConfig = () => {
  return true;
};
