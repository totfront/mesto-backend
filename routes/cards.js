const router = require("express").Router();
const {
  getCards,
  createCard,
  deleteCard,
  addLikeToCard,
} = require("../controllers/cards");

router.get("/", getCards);
router.post("/", createCard);
router.delete("/:cardId", deleteCard);
router.put("/:cardId/likes", addLikeToCard);

module.exports = router;
