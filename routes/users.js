const { celebrate, Joi } = require("celebrate");
const validator = require("validator");
const router = require("express").Router();
const ForbiddenError = require('../errors/ForbiddenError');
const {
  getUsers,
  getUser,
  setCurrentUser,
  setUserAvatar,
  getCurrentUser,
} = require("../controllers/users");

const isUrlValid = (url) => {
  if (validator.isUrl(url)) {
    return url;
  }
  return new ForbiddenError("Невалидный url картинки");
};

router.patch("/me", celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), setCurrentUser);
router.patch("/me/avatar", celebrate({
  body: Joi.object().keys({
    // avatar: Joi.string().custom(isUrlValid),
    avatar: Joi.string().required(),
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
