const User = require("../models/user");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "400") {
        return res.status(400).send({
          message: `${err.message} : Переданы некорректные данные при создании пользователя.`,
        });
      }
      if (err.name === "404") {
        return res.status(404).send({
          message: `${err.message} : Пользователи не найдены.`,
        });
      }
      if (err.name === "500") {
        return res.status(500).send({
          message: `${err.message} : Ошибка по-умолчанию`,
        });
      }
    });
};
module.exports.getUser = (req, res) => {
  User.find({})
    .then((users) =>
      users.find((user) => {
        if (user._id == req.params.id) {
          return user;
        }
        return null;
      })
    )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "400") {
        return res.status(400).send({
          message: `${err.message} : Пользователь по указанному _id не найден.`,
        });
      }
      if (err.name === "404") {
        return res.status(404).send({
          message: `${err.message} : Пользователь с указанным _id не найден.`,
        });
      }
      if (err.name === "500") {
        return res.status(500).send({
          message: `${err.message} : Ошибка по-умолчанию`,
        });
      }
    });
};
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "400") {
        return res.status(400).send({
          message: `${err.message} : Переданы некорректные данные при создании пользователя.`,
        });
      }
      if (err.name === "404") {
        return res.status(404).send({
          message: `${err.message} : Пользователь с указанным _id не найден.`,
        });
      }
      if (err.name === "500") {
        return res.status(500).send({
          message: `${err.message} : Ошибка по-умолчанию`,
        });
      }
    });
};
module.exports.setCurrentUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.update({ _id: req.user._id }, { name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "400") {
        return res.status(400).send({
          message: `${err.message} : Переданы некорректные данные при обновлении профиля.`,
        });
      }
      if (err.name === "404") {
        return res.status(404).send({
          message: `${err.message} : Пользователь с указанным _id не найден.`,
        });
      }
      if (err.name === "500") {
        return res.status(500).send({
          message: `${err.message} : Ошибка по-умолчанию`,
        });
      }
    });
};
module.exports.setUsersAvatar = (req, res) => {
  const { avatar } = req.body;
  User.update({ _id: req.user._id }, { avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "400") {
        return res.status(400).send({
          message: `${err.message} : Переданы некорректные данные при обновлении аватара.`,
        });
      }
      if (err.name === "404") {
        return res.status(404).send({
          message: `${err.message} : Пользователь с указанным _id не найден.`,
        });
      }
      if (err.name === "500") {
        return res.status(500).send({
          message: `${err.message} : Ошибка по-умолчанию`,
        });
      }
    });
};
