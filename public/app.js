async function loadBooks() {
  const res = await fetch('/api/books');
  const books = await res.json();

  const tbody = document.querySelector('#books-table tbody');
  tbody.innerHTML = '';

  for (const book of books) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${book.rank}</td>
      <td>${book.title}</td>
      <td>${book.author ?? '—'}</td>
      <td>${book.price ? '$' + book.price.toFixed(2) : '—'}</td>
      <td>${book.weeks_on_list}</td>
    `;
    tbody.appendChild(row);
  }
}

loadBooks();