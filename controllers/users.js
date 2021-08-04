const User = require("../models/user");

module.exports.getUsers = (req, res) => {
  User.find({})
    .orFail(new Error("noUsers"))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.message === "noUsers") {
        return res.status(404).send({ message: "Пользователей не обнаружено" });
      }
      return res.status(500).send({ message: "Произошла ошибка" });
    });
};
module.exports.getUser = (req, res) => {
  User.find({ _id: req.params.id })
    .orFail(new Error("NotValid"))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.message === "NotValidId") {
        res.status(404).send({ message: "Пользователя нет в базе" });
      }
      res.status(500).send({ message: "Произошла ошибка" });
    });
};
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      return res
        .status(500)
        .send({ message: `(${err}) - Пользователь не создан` });
    });
};
module.exports.setCurrentUser = (req, res) => {
  const { name, about } = req.body;
  User.update(
    { _id: req.user._id },
    { name, about },
    { new: true, runValidators: true }
  )
    .orFail(new Error("userIsNotUpdated"))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === "userIsNotUpdated") {
        return res
          .status(404)
          .send({ message: `(${err}) - Данные пользователя не обновлены` });
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
      if (err.message === "avatarIsNotUpdated") {
        return res
          .status(404)
          .send({ message: `(${err}) - Аватар не обновлен` });
      }
      return res.status(500).send({ message: `(${err}) - Произошла ошибка` });
    });
};
