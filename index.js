import express, { json } from 'express';
import cors from 'cors';
import * as database from './database.js';

const app = express();
const PORT = 8080;

app.use(cors());
app.use(json());
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
});

// GET
app.get('/books', async (req, res) => {
  const greatBooks = await database.getBooks();
  res.send(greatBooks);
});

app.get('/book/:id', async (req, res) => {
  const requestedBook = await database.getBook(req.params.id);
  res.send(requestedBook);
});

app.get('/greatbooks', async (req, res) => {
  const greatBooks = await database.getGreatBooks();
  res.send(greatBooks);
});

app.get('/goodbooks', async (req, res) => {
  const goodBooks = await database.getGoodBooks();
  res.send(goodBooks);
});

app.get('/alrightbooks', async (req, res) => {
  const alrightBooks = await database.getAlrightBooks();
  res.send(alrightBooks);
});

// POST
app.post('/book', async (req, res) => {
  const { name, pros, cons, file_url, amazon_product_id, google_play_product_id } = req.body;
  const newBook = await database.createBook(name, pros, cons, file_url, amazon_product_id, google_play_product_id);
  res.status(201).send(newBook);
});

// PUT
app.put('/book/:id', async (req, res) => {
  const { name, pros, cons, file_url, amazon_product_id, google_play_product_id } = req.body;
  const updatedBook = await database.updateBook(req.params.id, name, pros, cons, file_url, amazon_product_id, google_play_product_id);
  res.send(updatedBook);
});

// DELETE
app.delete('/book/:id', async (req, res) => {
  const bookToDelete = await database.getBook(req.params.id);
  await database.deleteBook(req.params.id);
  res.send('Sucessfully Deleted Book: ' + bookToDelete.name);
});

// SET BOOK ORDER
app.put('/greatbooks', async (req, res) => {
  const { book_ids } = req.body;
  await database.resetGreatBooks(book_ids);
  res.send(await database.getGreatBooks());
});

app.put('/goodbooks', async (req, res) => {
  const { book_ids } = req.body;
  await database.resetGoodBooks(book_ids);
  res.send(await database.getGoodBooks());
});

app.put('/alrightbooks', async (req, res) => {
  const { book_ids } = req.body;
  await database.resetAlrightBooks(book_ids);
  res.send(await database.getAlrightBooks());
});
