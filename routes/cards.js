const { celebrate, Joi } = require("celebrate");
const router = require("express").Router();
const {
  getCards,
  createCard,
  deleteCard,
  addLikeToCard,
  dislikeCard,
} = require("../controllers/cards");

router.get("/", getCards);
router.post(
  "/",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required(),
    }),
  }),
  createCard,
);
router.delete("/:cardId", celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().hex().length(24),
  }),
}), deleteCard);
router.put("/likes/:cardId", celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().hex().length(24),
  }),
}), addLikeToCard);
router.delete("/likes/:cardId", celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().hex().length(24),
  }),
}), dislikeCard);

module.exports = router;
