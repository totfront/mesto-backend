const router = require("express").Router();
const { getCards, createCard, deleteCard } = require("../controllers/cards");

router.get("/", getCards);
router.post("/", createCard);
router.delete("/:cardId", deleteCard);
// router.put("/:cardId/likes", addLike);

module.exports = router;
