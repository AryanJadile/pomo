import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '../.env') });

async function listTables() {
  const url = `${process.env.SUPABASE_URL}/rest/v1/?select=*`;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  try {
    const res = await fetch(url, {
      headers: {
        'apikey': key || '',
        'Authorization': `Bearer ${key}`
      }
    });
    
    console.log('STATUS:', res.status);
    const json = await res.json();
    console.log('TABLES FOUND:', Object.keys(json.definitions || {}).join(', '));
  } catch (err: any) {
    console.error('FETCH FAILED:', err.message);
  }
}

listTables();
