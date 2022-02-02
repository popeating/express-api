const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const db = require('../data/users');
const bcrypt = require('bcrypt');
dotenv.config();
const refreshList = {};

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(403).send('A token is required for authentication');
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
    req.decoded = decoded;
  } catch (err) {
    return res.status(401).send('Invalid Token');
  }
  return next();
};

const userLogin = async (req, res, next) => {
  const users = db.users;
  const user = users.find((item) => item.username === req.body.user);
  if (user) {
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (validPassword) {
      const token = generateAccessToken(user.username, user.email, user.level);
      req.token = token;
      const refreshToken = generateRefreshToken(
        user.username,
        user.email,
        user.level
      );
      req.refreshToken = refreshToken;
      req.content = {
        user: user.username,
        email: user.email,
        level: user.level,
      };

      addToList(refreshToken, token);
      return next();
    } else {
      res.status(400).json({ error: 'Invalid Password' });
    }
  } else {
    res.status(401).json({ error: 'User does not exist' });
  }
};

const tokenRefresh = (req, res, next) => {
  const postData = req.body;
  if (postData.refreshToken && postData.refreshToken in refreshList) {
    const decoded = jwt.verify(
      postData.refreshToken,
      process.env.SECRET_RTOKEN
    );

    const token = generateAccessToken(
      decoded.user,
      decoded.email,
      decoded.level
    );
    const refreshToken = generateRefreshToken(
      decoded.user,
      decoded.email,
      decoded.level
    );
    req.content = {
      user: decoded.user,
      email: decoded.email,
      level: decoded.level,
    };
    req.token = token;
    req.refreshToken = refreshToken;

    addToList(refreshToken, token);
  } else {
    return res.status(401).send("Can't refresh. Invalid Token");
  }
  next();
};

function generateAccessToken(username, email, level) {
  return jwt.sign(
    { user: username, email: email, level: level },
    process.env.SECRET_TOKEN,
    {
      expiresIn: '1h',
    }
  );
}

function generateRefreshToken(username, email, level) {
  return jwt.sign(
    { user: username, email: email, level: level },
    process.env.SECRET_RTOKEN,
    {
      expiresIn: '30d',
    }
  );
}

function addToList(refreshToken, token) {
  refreshList[refreshToken] = {
    status: 'loggedin',
    token: token,
    refreshtoken: refreshToken,
  };
}

module.exports = { verifyToken, userLogin, tokenRefresh };
