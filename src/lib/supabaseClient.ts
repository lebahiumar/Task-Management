import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = '//your_url';
const SUPABASE_KEY = 'your_key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
