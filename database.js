import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
}).promise();

// GET
export async function getBooks() {
  const [rows] = await pool.query(`SELECT * FROM books ORDER BY id`);
  return rows;
}

export async function getBook(id) {
  const [rows] = await pool.query(`SELECT * FROM books WHERE id = ?`, [id]);
  return rows[0];
}

export async function getGreatBooks() {
  const [rows] = await pool.query(`
    SELECT books.* FROM great_books
    INNER JOIN books ON books.id = great_books.book_id
    ORDER BY great_books.ranking
    `);
  return rows;
}

export async function getGoodBooks() {
  const [rows] = await pool.query(`
    SELECT books.* FROM good_books
    INNER JOIN books ON books.id = good_books.book_id
    ORDER BY good_books.ranking
    `);
  return rows;
}

export async function getAlrightBooks() {
  const [rows] = await pool.query(`
    SELECT books.* FROM alright_books
    INNER JOIN books ON books.id = alright_books.book_id
    ORDER BY alright_books.ranking
    `);
  return rows;
}

// POST
export async function createBook(name, pros, cons, fileUrl, amazonID, googlePlayID) {
  const [result] = await pool.query(`
    INSERT INTO books (name, pros, cons, file_url, amazon_product_id, google_play_product_id)
    VALUES (?, ?, ?, ?, ?, ?)
    `, [name, pros, cons, fileUrl, amazonID, googlePlayID]);
  return getBook(result.insertId);
}

// PUT
export async function updateBook(bookID, name, pros, cons, fileUrl, amazonID, googlePlayID) {
  await pool.query(`
    UPDATE books
    SET name = ?, pros = ?, cons = ?, file_url = ?, amazon_product_id = ?, google_play_product_id = ?
    WHERE id = ?;
    `, [name, pros, cons, fileUrl, amazonID, googlePlayID, bookID]);
  return getBook(bookID);
}

// DELETE
export async function deleteBook(bookID) {
  const result = await pool.query(`
    DELETE FROM books
    WHERE id = ?
    `, bookID);
}

// UPDATE GREAT BOOKS
async function clearGreatBooks() {
  await pool.query(`DELETE FROM great_books`);
}

async function insertIntoGreatBooks(bookIDs) {
  if (bookIDs && bookIDs.length > 0) {
    await pool.query(`INSERT INTO great_books (ranking, book_id) VALUES ${generateOrderedIDValues(bookIDs)};`);
  }
}

export async function resetGreatBooks(numbers) {
  await clearGreatBooks();
  await insertIntoGreatBooks(numbers);
}

// UPDATE GOOD BOOKS
async function clearGoodBooks() {
  await pool.query(`DELETE FROM good_books`);
}

async function insertIntoGoodBooks(bookIDs) {
  if (bookIDs && bookIDs.length > 0) {
    await pool.query(`INSERT INTO good_books (ranking, book_id) VALUES ${generateOrderedIDValues(bookIDs)};`);
  }
}

export async function resetGoodBooks(numbers) {
  await clearGoodBooks();
  await insertIntoGoodBooks(numbers);
}

// UPDATE ALRIGHT BOOKS
async function clearAlrightBooks() {
  await pool.query(`DELETE FROM alright_books`);
}

async function insertIntoAlrightBooks(bookIDs) {
  if (bookIDs && bookIDs.length > 0) {
    await pool.query(`INSERT INTO alright_books (ranking, book_id) VALUES ${generateOrderedIDValues(bookIDs)};`);
  }
}

export async function resetAlrightBooks(numbers) {
  await clearAlrightBooks();
  await insertIntoAlrightBooks(numbers);
}

// HELPERS
function generateOrderedIDValues(bookIDs) {
  return bookIDs.map((number, index) => `(${index}, ${number})`).join(", ")
}