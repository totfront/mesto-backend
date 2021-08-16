const router = require("express").Router();
const {
  getUsers,
  getUser,
  setCurrentUser,
  setUsersAvatar,
  getCurrentUser,
} = require("../controllers/users");

router.patch("/me", setCurrentUser);
router.patch("/me/avatar", setUsersAvatar);
router.get("/:id", getUser);
router.get("/", getUsers);
router.get("/me", getCurrentUser);

module.exports = router;
