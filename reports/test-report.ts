import axios from 'axios';

async function testScan() {
  const scanId = '75d119bf-0994-469b-9ef1-42099cc35c5c'; // Real ID from scan record
  console.log(`Testing report generation for scan: ${scanId}`);
  
  try {
    const response = await axios.post('http://localhost:3001/api/reports/generate', {
      scanId: scanId
    }, {
      responseType: 'arraybuffer'
    });
    
    console.log('SUCCESS: Received PDF buffer');
    console.log(`Buffer size: ${response.data.byteLength} bytes`);
  } catch (error: any) {
    if (error.response) {
      console.error(`FAILED: ${error.response.status} - ${error.response.data?.toString() || 'No detail'}`);
    } else {
      console.error(`ERROR: ${error.message}`);
    }
  }
}

testScan();
