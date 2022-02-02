const express = require('express');
const router = express.Router();

router.post('/signin', async (req, res) => {
  console.log(req.body);
  res.json({ message: 'SignIn', content: req.body });
});

module.exports = router;
