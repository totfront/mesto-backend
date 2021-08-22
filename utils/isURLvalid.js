const ForbiddenError = require('../errors/ForbiddenError');
const validator = require("validator");

const isUrlValid = (url) => {
  if (validator.isURL(url, {require_protocol: true})) {
    return url;
  }
  return new ForbiddenError("Невалидный url");
};

module.exports = isUrlValid;