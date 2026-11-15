import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xbghodxsnbriofdqcjcq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhiZ2hvZHhzbmJyaW9mZHFjamNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQxNjk5MTksImV4cCI6MjEwOTc0NTkxOX0.g8ZTxF2xkkjN0ExG4Yys23oSlZ8RR4gkaabVPuDEMno';

export const supabase = createClient(supabaseUrl, supabaseKey);