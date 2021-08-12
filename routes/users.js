const router = require("express").Router();
const {
  getUsers,
  getUser,
  createUser,
  setCurrentUser,
  setUsersAvatar,
} = require("../controllers/users");

router.patch("/me", setCurrentUser);
router.patch("/me/avatar", setUsersAvatar);
router.get("/:id", getUser);
router.get("/", getUsers);

module.exports = router;
