const errorsHandler = (err, req, res, next) => {
  const { message } = err;
  const status = err.statusCode;

  res.status(status).send({ message });
  next();
};

module.exports = errorsHandler;
