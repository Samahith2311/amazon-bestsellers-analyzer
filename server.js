const express = require('express');
require('dotenv').config();
const db = require('./db');

const app = express();
const PORT = 3000;

// Get the latest snapshot of every book (current rankings)
app.get('/api/books', (req, res) => {
  const rows = db.prepare(`
    SELECT b.id, b.title, b.author, b.publisher,
           s.rank, s.weeks_on_list, s.price, s.list_name, s.scraped_at
    FROM books b
    JOIN rank_snapshots s ON s.book_id = b.id
    WHERE s.scraped_at = (
      SELECT MAX(scraped_at) FROM rank_snapshots WHERE book_id = b.id
    )
    ORDER BY s.rank ASC
  `).all();

  res.json(rows);
});

// Get full rank history for one book (for trend charts later)
app.get('/api/books/:id/history', (req, res) => {
  const rows = db.prepare(`
    SELECT rank, price, weeks_on_list, scraped_at
    FROM rank_snapshots
    WHERE book_id = ?
    ORDER BY scraped_at ASC
  `).all(req.params.id);

  res.json(rows);
});

app.get('/', (req, res) => {
  res.send('Amazon Bestsellers Analyzer is running!');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});