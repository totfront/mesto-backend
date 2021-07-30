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

// Добавить лайк карточке
// module.exports.addLike = (req, res) => {
//   const { _id } = req.params.cardId;

//   Card.insert({
//     _id,
//   })
//     .then((card) => res.send({ data: card }))
//     .catch((err) => res.status(500).send({ message: err.message }));
// };

// Убрать лайк
