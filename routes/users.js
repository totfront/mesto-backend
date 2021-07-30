const router = require("express").Router();
const {
  getUsers,
  getUser,
  createUser,
  setCurrentUser,
} = require("../controllers/users");

router.patch("/me", setCurrentUser);
router.get("/:id", getUser);
router.get("/", getUsers);
router.post("/", createUser);

module.exports = router;
