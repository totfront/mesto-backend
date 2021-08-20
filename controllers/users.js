const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/user");
const NotFoundError = require("../errors/NotFoundError");
const InvalidError = require('../errors/InvalidError');
const ConflictError = require('../errors/ConflictError');
const ForbiddenError = require('../errors/ForbiddenError');
const UnauthorizedError = require('../errors/UnauthorizedError');

dotenv.config();

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => {
      if (user.length !== 0) {
        return res.send({ data: user });
      }
      return res.send({ data: "Нет пользователей" });
    })
    .catch((err) => res.status(500).send({ message: `${err.message} + Ошибка по умолчанию` }));
};
module.exports.getUser = (req, res, next) => {
  User.find({ _id: req.params.id })
    .orFail(new Error("noUser"))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.message === "noUser") {
        return next(new NotFoundError("Пользователя нет в базе"));
      }
      if (err.name === "CastError") {
        return next(new InvalidError('Невалидный id'));
      }
      return res
        .status(500)
        .send({ message: `${err.message} + Ошибка по умолчанию` });
    });
};
module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  if (validator.isEmail(email)) {
    User.findOne({ email }).then((user) => {
      if (user) {
        return next(new ConflictError('Пользователь с таким email уже существует'));
      }
      return bcrypt.hash(password, 10).then((hash) => {
        User.create({
          name,
          about,
          avatar,
          email,
          password: hash,
        })
          .then((userData) => res.send({ data: userData }))
          .catch((err) => {
            if (err.name === "ValidationError") {
              console.log(err.message);
              return next(new InvalidError('Переданы не валидные данные пользователя'));
            }
            return res
              .status(500)
              .send({ message: `${err.message} + Ошибка по умолчанию` });
          });
      });
    });
  } else {
    res.send("Невалидный email");
  }
};
module.exports.setCurrentUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    { _id: req.user._id },
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail(new Error("notFound"))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new InvalidError('Невалидный id'));
      }
      if (err.name === "ValidationError") {
        return next(new InvalidError('Невалидные данные пользователя'));
      }
      if (err.message === "notFound") {
        return next(new NotFoundError("Пользователь не найден"));
      }
      return res.status(500).send({ message: `(${err}) - Произошла ошибка` });
    });
};
module.exports.setUsersAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    { _id: req.user._id },
    { avatar },
    { new: true, runValidators: true },
  )
    .orFail(new Error("notFound"))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new InvalidError('Невалидный id'));
      }
      if (err.name === "ValidationError") {
        return next(new InvalidError("Невалидные данные"));
      }
      if (err.message === "notFound") {
        return next(new NotFoundError("Пользователь не найден"));
      }
      return res.status(500).send({ message: `(${err}) - Произошла ошибка` });
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new InvalidError("Email или пароль не могут быть пустыми"));
  }

  return User.findOne({ email })
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Неправильный пароль или логин'));
      }
      return bcrypt.compare(password, user.password, (error, isValid) => {
        if (error) {
          return next(new ForbiddenError(`${error} + В доступе отказано`));
        }
        if (!isValid) {
          return next(new UnauthorizedError('Неправильный пароль или логин'));
        }
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
          expiresIn: "7d",
        });
        return res
          .cookie("jwt", token, {
            httpOnly: true,
            sameSite: true,
          })
          .status(200)
          .send({ user: user.toJSON() });
      });
    })
    .catch((err) => next(new UnauthorizedError(err.message)));
};

module.exports.getCurrentUser = (req, res, next) => {
  User.find({ _id: req.params.id })
    .orFail(new Error("noUser"))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.message === "noUser") {
        return next(new NotFoundError('Пользователя нет в базе'));
      }
      if (err.name === "CastError") {
        return next(new InvalidError('Невалидный id'));
      }
      return res
        .status(500)
        .send({ message: `${err.message} + Ошибка по умолчанию` });
    });
};
