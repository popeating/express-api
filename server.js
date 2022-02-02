const express = require('express');

// Create express app
const app = express();

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Hello, World!' });
});

const AuthRoute = require('./routes/auth');
const BooksRoute = require('./routes/books');

app.use('/v1/auth', AuthRoute);
app.use('/v1/books', BooksRoute);

// Starting server
app.listen(3000, console.log('Listening on port 3000'));
