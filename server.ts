import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;
const DATA_FILE = path.resolve(__dirname, 'data.json');

app.use(express.json());

interface AppData {
  energyLogs: unknown[];
  projects: unknown[];
  tasks: unknown[];
  parkingLotItems: unknown[];
  weeklyPlan: unknown;
}

function readData(): AppData {
  if (!fs.existsSync(DATA_FILE)) {
    return { energyLogs: [], projects: [], tasks: [], parkingLotItems: [], weeklyPlan: null } as unknown as AppData;
  }
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}

function writeData(data: AppData) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// Get all data
app.get('/api/data', (_req, res) => {
  const data = readData();
  res.json(data);
});

// Save all data
app.post('/api/data', (req, res) => {
  writeData(req.body);
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Storage server running on http://localhost:${PORT}`);
});
