import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '../.env') });

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function listAll() {
    console.log('--- SCANNING ALL SCHEMAS ---');
    // Try to get anything from public schema
    const { data, error } = await supabase.rpc('get_tables'); // If they have a helper rpc
    if (error) {
        console.log('RPC FAILED, trying direct select...');
        const { data: d2, error: e2 } = await supabase.from('profiles').select('*').limit(1);
        if (e2) {
            console.error('PROFILES ALSO MISSING:', e2.message);
        } else {
            console.log('PROFILES TABLE EXISTS. Connection is working.');
        }
    }
}

listAll();
