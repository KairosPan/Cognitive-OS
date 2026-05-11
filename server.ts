import express from 'express';
import { getAllData, saveAllData } from './database.js';

const app = express();
const PORT = 3001;

app.use(express.json({ limit: '10mb' }));

// Get all data
app.get('/api/data', (_req, res) => {
  try {
    const data = getAllData();
    res.json(data);
  } catch (err) {
    console.error('Failed to read data:', err);
    res.status(500).json({ error: 'Failed to read data' });
  }
});

// Save all data
app.post('/api/data', (req, res) => {
  try {
    saveAllData(req.body);
    res.json({ ok: true });
  } catch (err) {
    console.error('Failed to save data:', err);
    res.status(500).json({ error: 'Failed to save data' });
  }
});

app.listen(PORT, () => {
  console.log(`Storage server running on http://localhost:${PORT} (SQLite backend)`);
});
