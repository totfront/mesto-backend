const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const UnauthorizedError = require('../errors/UnauthorizedError');

dotenv.config();

const { JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  if (!req.cookies.jwt) {
    return next(new UnauthorizedError('Токен не найден и авторизация не прошла'));
  }
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new UnauthorizedError('Авторизация не прошла'));
  }
  req.user = payload;
  return next();
};

module.exports = auth;
