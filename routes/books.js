const express = require('express');
const router = express.Router();
const db = require('../data/books');
const { verifyToken } = require('../middleware/auth');

router.get('/', verifyToken, async (req, res) => {
  res.json({ message: 'All Books', books: db.books });
});

router.get('/get/:id', async (req, res) => {
  const books = db.books;
  const id = req.params.id;
  const book = books.find((item) => item.id === id);
  res.json({ message: `Search by id #${req.params.id}`, book: book });
});

module.exports = router;
