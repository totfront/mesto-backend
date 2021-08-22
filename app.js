const express = require("express");
const validator = require("validator");
const { celebrate, errors, Joi } = require('celebrate');
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const errorsHandler = require("./middlewares/errorsHandler");
const NotFoundError = require('./errors/NotFoundError');
const isUrlValid = require("./utils/isUrlValid");

const auth = require("./middlewares/auth");

dotenv.config();

const { PORT = 3000 } = process.env;

const app = express();

app.use(cookieParser());

mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(helmet());

app.use("/signin", celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), require("./routes/signin"));
app.use("/signup", celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(isUrlValid),
  }),
}), require("./routes/signup"));

app.use(auth);

app.use("/users", require("./routes/users"));
app.use("/cards", require("./routes/cards"));

app.use("*", (req, res, next) => next(new NotFoundError('Запрашиваемый ресурс не найден')));

app.use(errors());
app.use(errorsHandler);
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
