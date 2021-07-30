const Card = require("../models/card");

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.createCard = (req, res) => {
  const { name, link, _id } = req.body;

  Card.create({
    name,
    link,
    _id,
  })
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.deleteCard = (req, res) => {
  Card.findOneAndDelete({
    _id: req.params.cardId,
  })
    .then((card) => {
      return res.send({ data: card });
    })
    .catch((err) => res.status(500).send({ message: err.message }));
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
    .catch((err) => res.status(500).send({ message: err.message }));
};
