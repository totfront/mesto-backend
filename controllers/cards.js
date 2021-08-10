const Card = require("../models/card");

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((card) => {
      if (card.length !== 0) {
        return res.send({ data: card });
      }
      return res.send({ data: "Нет карточек" });
    })
    .catch((err) => res.status(500).send({ message: `${err.message} + Ошибка по умолчанию` }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({
    name,
    link,
    owner: req.user._id,
  })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({
          message: `${err.message} + Переданы некорректные данные в методы создания карточки`,
        });
      }
      return res.status(500).send({
        message: `${err.message} + Ошибка по умолчанию`,
      });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findOneAndDelete({
    _id: req.params.cardId,
  })
    .orFail(new Error("NotFound"))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Невалидный id " });
      }
      if (err.message === "NotFound") {
        return res
          .status(404)
          .send({ message: "Карточки с указанным id не существует" });
      }
      return res.status(500).send({
        message: `${err.message} + Ошибка по умолчанию`,
      });
    });
};

module.exports.addLikeToCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(new Error("NotValid"))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Невалидный id " });
      }
      if (err.message === "NotValid") {
        return res
          .status(404)
          .send({ message: "Карточки с указанным id не существует" });
      }
      return res.status(500).send({
        message: `${err.message} + Ошибка по умолчанию`,
      });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(new Error("NotFound"))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Невалидный id " });
      }
      if (err.message === "NotFound") {
        return res
          .status(404)
          .send({ message: "Карточки с указанным id не существует" });
      }
      return res.status(500).send({
        message: `${err.message} + Ошибка по умолчанию`,
      });
    });
};
