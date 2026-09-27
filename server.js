const express = require('express');
require('dotenv').config();

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Amazon Bestsellers Analyzer is running!');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});