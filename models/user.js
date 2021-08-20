const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: "Жак-Ив Кусто",
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: "Исследователь",
  },
  avatar: {
    type: String,
    default:
      "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
    validate: (value) => validator.isURL(value, { require_protocol: true }),
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: (value) => validator.isEmail(value),
  },
  password: {
    type: String,
    required: true,
  },
});

function toJSON() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
}

userSchema.methods.toJSON = toJSON;

module.exports = mongoose.model("user", userSchema);
