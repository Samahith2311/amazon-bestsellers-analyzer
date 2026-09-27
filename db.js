const Database = require('better-sqlite3');
const db = new Database('./bestsellers.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    isbn TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    author TEXT,
    publisher TEXT
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS rank_snapshots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    book_id INTEGER NOT NULL,
    scraped_at TEXT NOT NULL,
    rank INTEGER,
    weeks_on_list INTEGER,
    price REAL,
    list_name TEXT,
    FOREIGN KEY (book_id) REFERENCES books(id)
  )
`);

module.exports = db;