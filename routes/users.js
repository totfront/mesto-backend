const { celebrate, Joi } = require("celebrate");
const router = require("express").Router();
const isUrlValid = require("../utils/isUrlValid");
const {
  getUsers,
  getUser,
  setCurrentUser,
  setUserAvatar,
  getCurrentUser,
} = require("../controllers/users");

router.patch("/me", celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), setCurrentUser);
router.patch("/me/avatar", celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(isUrlValid),
  }),
}), setUserAvatar);
router.get("/:id", celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().hex().length(24),
  }),
}), getUser);
router.get("/", getUsers);
router.get("/me", getCurrentUser);

module.exports = router;
