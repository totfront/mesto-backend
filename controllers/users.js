const validator = require("validator");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require("../models/user");

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
module.exports.getUser = (req, res) => {
  User.find({ _id: req.params.id })
    .orFail(new Error("noUser"))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.message === "noUser") {
        return res.status(404).send({ message: "Пользователя нет в базе" });
      }
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Невалидный id " });
      }
      return res
        .status(500)
        .send({ message: `${err.message} + Ошибка по умолчанию` });
    });
};
module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  if (validator.isEmail(email)) {
    bcrypt.hash(password, 10)
      .then((hash) => {
        User.create({
          name,
          about,
          avatar,
          email,
          password: hash,
        })
          .then((user) => res.send({ data: user }))
          .catch((err) => {
            if (err.name === "ValidationError") {
              return res.status(400).send({
                message: `${err.message} + Переданы не валидные данные пользователя`,
              });
            }
            return res
              .status(500)
              .send({ message: `${err.message} + Ошибка по умолчанию` });
          });
      });
  } else {
    res.send("Невалидный email");
  }
};
module.exports.setCurrentUser = (req, res) => {
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
        return res.status(400).send({ message: "Невалидный id " });
      }
      if (err.name === "ValidationError") {
        return res
          .status(400)
          .send({ message: "Невалидные данные пользователя" });
      }
      if (err.message === "notFound") {
        return res.status(404).send({
          message: `(${err}) - Пользователь не найден`,
        });
      }
      return res.status(500).send({ message: `(${err}) - Произошла ошибка` });
    });
};
module.exports.setUsersAvatar = (req, res) => {
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
        res.status(400).send({ message: "Невалидный id " });
      }
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: "Невалидные данные" });
      }
      if (err.message === "notFound") {
        return res
          .status(404)
          .send({ message: `(${err}) - Пользователь не найден` });
      }
      return res.status(500).send({ message: `(${err}) - Произошла ошибка` });
    });
};

module.exports.login = (req, res) => {
  let token;
  const { email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        // hashes did not compared — reject promise
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      // auth is successful
      return res.send({ message: 'Всё верно!' });
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};
