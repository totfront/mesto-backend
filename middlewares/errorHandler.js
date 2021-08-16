const errorHandler = (err, req, res) => {
  const status = 404;
  const { message } = err;

  res.status(status).json({ err: `${message} Произошла ошибка на сервере` });
};

module.exports = errorHandler;
