import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '../.env') });

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function listScans() {
  console.log('--- DB DEBUG START ---');
  console.log('URL:', supabaseUrl);
  console.log('KEY (prefix):', supabaseServiceKey.slice(0, 20));
  
  try {
    const promise = supabase.from('scans').select('*').limit(3);
    const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('TIMEOUT after 10s')), 10000));
    
    const result: any = await Promise.race([promise, timeout]);
    
    if (result.error) {
      console.error('SUPABASE ERROR:', result.error);
    } else {
      console.log('SUCCESS: Found', result.data?.length, 'scans');
      result.data?.forEach((s: any) => console.log(`ID: ${s.id}`));
    }
  } catch (err: any) {
    console.error('SCRIPT CRASHED:', err.message);
  }
}

listScans();
