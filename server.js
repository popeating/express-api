const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

// Create express app
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', async (req, res) => {
  res.json({ message: 'Books API, please sign in at /v1/auth/signin' });
});

const AuthRoute = require('./routes/auth');
const BooksRoute = require('./routes/books');

app.use('/v1/auth', AuthRoute);
app.use('/v1/books', BooksRoute);

// Starting server
app.listen(
  process.env.PORT,
  console.log('Listening on port ', process.env.PORT)
);
