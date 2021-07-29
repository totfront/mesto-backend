const router = require("express").Router();
const { getUsers, getUser, createUser } = require("../controllers/users");

router.get("/:id", getUser);
router.get("/", getUsers);
router.post("/", createUser);

module.exports = router;
