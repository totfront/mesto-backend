const router = require("express").Router();
const { getCards, createCard } = require("../controllers/cards");

router.get("/", getCards);
router.post("/", createCard);

module.exports = router;
