const router = require("express").Router();
const {
  getCards,
  createCard,
  deleteCard,
  addLikeToCard,
  dislikeCard,
} = require("../controllers/cards");

router.get("/", getCards);
router.post("/", createCard);
router.delete("/:cardId", deleteCard);
router.put("/:cardId/likes", addLikeToCard);
router.delete("/:cardId/likes", dislikeCard);

module.exports = router;
