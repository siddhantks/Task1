const express = require('express');
const crypto = require('crypto');
const app = express();
app.use(express.json());

let database = []; // Simulated DB storage
let processedHashes = new Set(); // To prevent double counting

// Normalization Layer
const normalizeEvent = (raw) => {
  const payload = raw.payload || {};
  return {
    client_id: raw.source || 'unknown',
    metric: payload.metric || 'n/a',
    amount: parseFloat(payload.amount) || 0, // String to Number
    timestamp: new Date(payload.timestamp || Date.now()).toISOString(), // Consistent format
    received_at: new Date().toISOString()
  };
};

app.post('/ingest', (req, res) => {
  try {
    const rawData = req.body;
    
    // Deduplication: Create a unique fingerprint of the data
    const eventHash = crypto.createHash('md5').update(JSON.stringify(rawData)).digest('hex');
    
    if (processedHashes.has(eventHash)) {
      return res.status(200).json({ status: 'duplicate', message: 'Event already processed' });
    }

    // Simulate failure if the UI checkbox is checkedc
    if (req.headers['x-simulate-failure'] === 'true') {
      throw new Error("Database write failed mid-request");
    }

    const normalized = normalizeEvent(rawData);
    database.push(normalized); // Write to "DB" 
    processedHashes.add(eventHash); // Only add hash if write succeeds

    res.status(201).json({ status: 'success', data: normalized });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Aggregation API 
app.get('/aggregates', (req, res) => {
  const totalAmount = database.reduce((sum, item) => sum + item.amount, 0);
  res.json({ total_count: database.length, total_amount: totalAmount });
});

app.listen(3001, () => console.log('Server running on port 3001'));
