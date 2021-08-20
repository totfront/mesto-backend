const Card = require("../models/card");
const NotFoundError = require("../errors/NotFoundError");
const InvalidError = require('../errors/InvalidError');

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

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({
    name,
    link,
    owner: req.user._id,
  })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new InvalidError('Переданы некорректные данные в методы создания карточки'));
      }
      return res.status(500).send({
        message: `${err.message} + Ошибка по умолчанию`,
      });
    });
};

module.exports.deleteCard = (req, res, next) => {
  const owner = req.user._id;
  Card.findOne({ _id: req.params.cardId })
    .orFail(new Error("NotFound"))
    .then((card) => {
      if (card.owner !== owner) {
        return next(new InvalidError('You cant delete this card'));
      }
      return Card.deleteOne({ _id: req.params.cardId })
        .then((foundCard) => res.send({ data: foundCard, status: 'deleted' }))
        .catch((err) => res.status(500).send({ message: `${err.message} + ошибка по умолчанию` }));
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new InvalidError('Невалидный id'));
      }
      if (err.message === "NotFound") {
        return next(new NotFoundError('Карточки с указанным id не существует'));
      }
      return res.status(500).send({
        message: `${err.message} + Ошибка по умолчанию`,
      });
    });
};

module.exports.addLikeToCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(new Error("NotFound"))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new InvalidError('Невалидный id'));
      }
      if (err.message === "NotFound") {
        return next(new NotFoundError("Карточки с указанным id не существует"));
      }
      return res.status(500).send({
        message: `${err.message} + Ошибка по умолчанию`,
      });
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(new Error("NotFound"))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new InvalidError('Невалидный id'));
      }
      if (err.message === "NotFound") {
        return next(new NotFoundError('Карточки с указанным id не существует'));
      }
      return res.status(500).send({
        message: `${err.message} + Ошибка по умолчанию`,
      });
    });
};
