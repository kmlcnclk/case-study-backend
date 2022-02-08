const expressAsyncHandler = require('express-async-handler');

const isFieldExist = expressAsyncHandler(async (req, res, next) => {
  const { email, name, country, message } = req.body;

  if (!email) {
    return next(new CustomError('Email field is required', 404));
  }

  if (!name) {
    return next(new CustomError('Name field is required', 404));
  }

  if (!country) {
    return next(new CustomError('Country field is required', 404));
  }

  if (!message) {
    return next(new CustomError('Message field is required', 404));
  }

  next();
});

module.exports = {
  isFieldExist,
};
