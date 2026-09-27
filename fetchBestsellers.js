require('dotenv').config();
const db = require('./db');

const API_KEY = process.env.NYT_API_KEY;
const LIST_NAME = 'hardcover-fiction';

async function fetchList() {
  const url = `https://api.nytimes.com/svc/books/v3/lists/current/${LIST_NAME}.json?api-key=${API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.results.books;
}

const upsertBook = db.prepare(`
  INSERT INTO books (isbn, title, author, publisher)
  VALUES (?, ?, ?, ?)
  ON CONFLICT(isbn) DO UPDATE SET
    title=excluded.title,
    author=excluded.author,
    publisher=excluded.publisher
`);

const getBookId = db.prepare(`SELECT id FROM books WHERE isbn = ?`);

const insertSnapshot = db.prepare(`
  INSERT INTO rank_snapshots (book_id, scraped_at, rank, weeks_on_list, price, list_name)
  VALUES (?, ?, ?, ?, ?, ?)
`);

async function main() {
  const books = await fetchList();
  console.log(`Fetched ${books.length} books from '${LIST_NAME}'`);

  for (const book of books) {
    const isbn = book.primary_isbn13 || book.primary_isbn10;
    upsertBook.run(isbn, book.title, book.author, book.publisher);
    const { id: bookId } = getBookId.get(isbn);

    const price = book.price && book.price !== '0.00' ? parseFloat(book.price) : null;
    insertSnapshot.run(bookId, new Date().toISOString(), book.rank, book.weeks_on_list, price, LIST_NAME);
  }

  console.log('Done.');
}

main();