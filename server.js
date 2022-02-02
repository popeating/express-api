const express = require('express');
const dotenv = require('dotenv');

dotenv.config();
// console.log(process.env.SECRET_TOKEN);

// Create express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', async (req, res) => {
  res.json({ message: 'Hello, World!' });
});

const AuthRoute = require('./routes/auth');
const BooksRoute = require('./routes/books');

app.use('/v1/auth', AuthRoute);
app.use('/v1/books', BooksRoute);

// Starting server
app.listen(3000, console.log('Listening on port 3000'));
