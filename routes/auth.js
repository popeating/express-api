const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { userLogin, tokenRefresh } = require('../middleware/auth');

dotenv.config();

router.post('/generatepassword', async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password, salt);
  res.json({ 'Generated password': password });
});

router.post('/signin', userLogin, async (req, res) => {
  res.json({
    message: 'SignIn',
    content: req.content,
    JWT: req.token,
    refresh: req.refreshToken,
  });
});

router.post('/refresh', tokenRefresh, async (req, res) => {
  res.json({
    message: 'Refresh',
    content: req.content,
    JWT: req.token,
    refresh: req.refreshToken,
  });
});

module.exports = router;
