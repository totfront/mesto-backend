const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const helmet = require("helmet");

const { PORT = 3000, BASE_PATH } = process.env;

const app = express();

mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(helmet());
app.use((req, res, next) => {
  req.user = {
    _id: "61027bfaec7a212ab4bba827",
  };
  next();
});

app.use("/users", require("./routes/users"));
app.use("/cards", require("./routes/cards"));

app.use("*", (req, res) => {
  res
    .status(400)
    .send(JSON.stringify({ message: "Запрашиваемый ресурс не найден" }));
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
