const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Endpoint dummy untuk ngecek server jalan
app.get('/', (req, res) => {
  res.send('Server Backend UAS Jalan Bos!');
});

// Kalau mau advanced, API Key Etherscan ditaruh sini biar aman (env), 
// tapi buat UAS taruh di frontend dulu gpp biar gampang.

app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});