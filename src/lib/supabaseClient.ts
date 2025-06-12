import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ogfwhrhvoqzhcrtasvfa.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nZndocmh2b3F6aGNydGFzdmZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3MDEzNTQsImV4cCI6MjA2NTI3NzM1NH0.9c3a21xRcWaTS1TkyvTQntUlIkltGEwIl-xCEg-ohZA';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
