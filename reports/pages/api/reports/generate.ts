import { createClient } from '@supabase/supabase-js';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import { buildReportHtml, type ScanData } from '../../../lib/reportTemplate.js';
import dotenv from 'dotenv';
import path from 'path';

// For local development, .env is in the root (../../)
// For Vercel, it depends on the deployment structure, but process.cwd() is generally reliable.
dotenv.config({ path: path.join(process.cwd(), '../.env') });

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { scanId } = req.body;

  if (!scanId) {
    return res.status(400).json({ error: 'scanId is required' });
  }

  try {
    // 1. Fetch scan data
    const { data: scan, error: scanError } = await (supabase as any)
      .from('scans')
      .select('*')
      .eq('id', scanId)
      .single();

    if (scanError || !scan) {
      return res.status(404).json({ error: 'Scan not found' });
    }

    // 2. Fetch user profile for name
    const { data: profile } = await (supabase as any)
      .from('profiles')
      .select('*')
      .eq('id', scan.user_id)
      .single();

    const userProfile = {
      full_name: profile?.full_name || 'Agrotechnician',
      phone: profile?.phone
    };

    // 3. Build HTML
    const html = buildReportHtml(scan as unknown as ScanData, userProfile);

    // 4. Generate PDF with Puppeteer
    let executablePath = await chromium.executablePath();
    
    // For local development, Sparticuz Chromium often fails to extract correctly,
    // so we fallback to the local Google Chrome installation based on OS.
    if (process.platform === 'win32') {
      executablePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
    } else if (process.platform === 'darwin') {
      executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
    }

    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: (chromium as any).defaultViewport || null,
      executablePath: executablePath,
      headless: (chromium as any).headless || true,
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '40px',
        bottom: '40px',
        left: '40px',
        right: '40px'
      }
    });

    await browser.close();

    // 5. Send PDF
    const filename = `PomeGuard_Report_${scanId.slice(0, 8).toUpperCase()}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.send(pdf);

  } catch (error: any) {
    console.error('PDF Generation Error:', error);
    return res.status(500).json({ error: `Failed to generate PDF: ${error.message}` });
  }
}
