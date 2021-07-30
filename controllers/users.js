const User = require("../models/user");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: err.message }));
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
    .catch((err) => res.status(500).send({ message: err.message }));
};
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: err.message }));
};
module.exports.setCurrentUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.update({ _id: req.user._id }, { name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => res.status(500).send({ message: err.message }));
};
module.exports.setUsersAvatar = (req, res) => {
  const { avatar } = req.body;
  User.update({ _id: req.user._id }, { avatar })
    .then((user) => res.send(user))
    .catch((err) => res.status(500).send({ message: err.message }));
};
