import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '../.env') });

async function testFetch() {
  const url = `${process.env.SUPABASE_URL}/rest/v1/scans?select=*&limit=1`;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  console.log('Fetching URL:', url);
  
  try {
    const res = await fetch(url, {
      headers: {
        'apikey': key || '',
        'Authorization': `Bearer ${key}`
      }
    });
    
    console.log('STATUS:', res.status);
    const text = await res.text();
    console.log('RESPONSE:', text.slice(0, 100));
  } catch (err: any) {
    console.error('FETCH FAILED:', err.message);
  }
}

testFetch();
