import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '../.env') });

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testFetch() {
  console.log('Fetching scan...');
  const { data, error } = await supabase.from('scans').select('*').limit(1).single();
  
  if (error) {
    console.error('FAILED TO FETCH SCAN:', error.message);
  } else {
    console.log('SUCCESS: Found Sample Scan');
    console.log(`ID: ${data.id}`);
    console.log(`Disease: ${data.result?.disease || 'N/A'}`);
  }
}

testFetch();
