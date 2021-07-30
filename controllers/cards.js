const Card = require("../models/card");

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "400") {
        return res.status(400).send({
          message: `${err.message} + Переданы некорректные данные при создании карточки`,
        });
      }
      if (err.name === "404") {
        return res.status(404).send({
          message: `${err.message} + Карточка не найдена`,
        });
      }
      if (err.name === "500") {
        return res.status(500).send({
          message: `${err.message} + Ошибка по-умолчанию`,
        });
      }
    });
};

module.exports.createCard = (req, res) => {
  const { name, link, _id } = req.body;

  Card.create({
    name,
    link,
    _id,
  })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "400") {
        return res.status(400).send({
          message: `${err.message} + Переданы некорректные данные при создании карточки`,
        });
      }
      if (err.name === "404") {
        return res.status(404).send({
          message: `${err.message} + Карточка не найдена`,
        });
      }
      if (err.name === "500") {
        return res.status(500).send({
          message: `${err.message} + Ошибка по-умолчанию`,
        });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findOneAndDelete({
    _id: req.params.cardId,
  })
    .then((card) => {
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === "400") {
        return res.status(400).send({
          message: `${err.message} + Переданы некорректные данные в методы создания карточки`,
        });
      }
      if (err.name === "404") {
        return res.status(404).send({
          message: `${err.message} + Карточка с указанным _id не найдена`,
        });
      }
      if (err.name === "500") {
        return res.status(500).send({
          message: `${err.message} + Ошибка по-умолчанию`,
        });
      }
    });
};

module.exports.addLikeToCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }
  )
    .then((card) => {
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === "400") {
        return res.status(400).send({
          message: `${err.message} +  : Переданы некорректные данные для постановки лайка.`,
        });
      }
      if (err.name === "404") {
        return res.status(404).send({
          message: `${err.message} : Карточка не найдена`,
        });
      }
      if (err.name === "500") {
        return res.status(500).send({
          message: `${err.message} + Ошибка по-умолчанию`,
        });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }
  )
    .then((card) => {
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === "400") {
        return res.status(400).send({
          message: `${err.message} + Переданы некорректные данные для снятии лайка`,
        });
      }
      if (err.name === "404") {
        return res.status(404).send({
          message: `${err.message} + Карточка не найдена`,
        });
      }
      if (err.name === "500") {
        return res.status(500).send({
          message: `${err.message} + Ошибка по-умолчанию`,
        });
      }
    });
};
