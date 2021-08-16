const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const auth = (req, res, next) => {
  if (!req.cookies.jwt) {
    next(
      res
        .status(401)
        .send({ message: "Токен не найден и авторизация не прошла" }),
    );
    return;
  }
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(res.status(401).send({ message: "Авторизация не прошла" }));
  }
  req.user = payload;
  next();
};

module.exports = auth;
