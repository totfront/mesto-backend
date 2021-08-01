const User = require("../models/user");

module.exports.getUsers = (req, res) => {
  User.find({})
    .orFail(new Error("noUsers"))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.message === "noUsers") {
        return err.status(404).send({ message: "Пользователей не обнаружено" });
      }
      return err.status(500).send({ message: "Произошла ошибка" });
    });
};
module.exports.getUser = (req, res) => {
  User.find({})
    .orFail(new Error("NotValid"))
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
      if (err.message === "NotValidId") {
        return res.status(404).send({ message: "Пользователя нет в базе" });
      }
      return res.status(500).send({ message: "Произошла ошибка" });
    });
};
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .orFail(new Error("userIsNotCreated"))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.message === "userIsNotCreated") {
        return err.status(404).message({ message: "Пользователь не создан" });
      }
      return err.status(500).message({ message: "Произошла ошибка" });
    });
};
module.exports.setCurrentUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.update(
    { _id: req.user._id },
    { name, about, avatar },
    { new: true, runValidators: true }
  )
    .orFail(new Error("userIsNotUpdated"))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === "userIsNotUpdated") {
        return err
          .status(404)
          .message({ message: "Данные пользователя не обновлены" });
      }
      return err.status(500).message({ message: "Произошла ошибка" });
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
        return err.status(404).message({ message: "Аватар не обновлен" });
      }
      return err.status(500).message({ message: "Произошла ошибка" });
    });
};
