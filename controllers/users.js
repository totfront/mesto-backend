const User = require("../models/user");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => {
      if (user.length !== 0) {
        return res.send({ data: user });
      }
      return res.send({ data: "Нет пользователей" });
    })
    .catch((err) => {
      return res
        .status(500)
        .send({ message: `${err.message} + Ошибка по умолчанию` });
    });
};
module.exports.getUser = (req, res) => {
  User.find({ _id: req.params.id })
    .orFail(new Error("noUser"))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.message === "noUser") {
        res.status(404).send({ message: "Пользователя нет в базе" });
      }
      if (err.name === "CastError") {
        res.status(400).send({ message: "Невалидный id " });
      }
      res.status(500).send({ message: `${err.message} + Ошибка по умолчанию` });
    });
};
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      console.log(err.name);
      if (err.name === "ValidationError") {
        res.status(400).send({
          message: `${err.message} + Переданы не валидные данные пользователя`,
        });
      }
      res.status(500).send({ message: `${err.message} + Ошибка по умолчанию` });
    });
};
module.exports.setCurrentUser = (req, res) => {
  const { name, about } = req.body;
  User.update(
    { _id: req.user._id },
    { name, about },
    { new: true, runValidators: true }
  )
    .orFail(new Error("notUpdated"))
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
      if (err.message === "notUpdated") {
        return res.status(404).send({
          message: `(${err}) - Данные пользователя не обновлены`,
        });
      }
      return res.status(500).send({ message: `(${err}) - Произошла ошибка` });
    });
};
module.exports.setUsersAvatar = (req, res) => {
  const { avatar } = req.body;
  User.update(
    { _id: req.user._id },
    { avatar },
    { new: true, runValidators: true }
  )
    .orFail(new Error("avatarIsNotUpdated"))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(400).send({ message: "Невалидный id " });
      }
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: "Невалидные данные" });
      }
      if (err.message === "avatarIsNotUpdated") {
        return res
          .status(404)
          .send({ message: `(${err}) - Аватар не обновлен` });
      }
      return res.status(500).send({ message: `(${err}) - Произошла ошибка` });
    });
};
