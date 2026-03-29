import express from 'express';
import cors from 'cors';
import handler from './pages/api/reports/generate.js';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Mock Next.js internal API route handler for local development
app.post('/api/reports/generate', async (req, res) => {
  // Mock res methods that Next.js handlers expect
  const nextRes = {
    status: (code: number) => ({
      json: (data: any) => res.status(code).json(data),
      send: (data: any) => res.status(code).send(data),
    }),
    setHeader: (name: string, value: string) => res.setHeader(name, value),
    send: (data: any) => res.send(data),
  };
  
  await handler(req, nextRes);
});

app.listen(port, () => {
  console.log(`PomeGuard Reporting Service listening at http://localhost:${port}`);
});
