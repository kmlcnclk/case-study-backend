const asyncHandler = require('express-async-handler');
const User = require('../../databases/models/UserModel');

const {
  isTokenIncluded,
  getAccessTokenFromHeader,
} = require('../../helpers/auth/tokenHelpers');
const CustomError = require('../../errors/CustomError');
const jwt = require('jsonwebtoken');

// Get access to route
const getAccessToRoute = (req, res, next) => {
  const { JSON_SECRET_KEY } = process.env;

  if (!isTokenIncluded(req)) {
    return next(
      new CustomError('You are not authorized to access this routeasd', 401)
    );
  }

  const accessToken = getAccessTokenFromHeader(req);
  jwt.verify(accessToken, JSON_SECRET_KEY, (err, decoded) => {
    if (err) {
      return next(
        new CustomError('You are not authorized to access this route', 401)
      );
    }

    req.user = {
      id: decoded.id,
      name: decoded.name,
    };
    next();
  });
};

// Is the user registered ?
const isTheUserRegistered = asyncHandler(async (req, res, next) => {
  const { email, name } = req.body;

  const user =
    (await User.findOne({ email })) || (await User.findOne({ name }));

  if (user) {
    return next(
      new CustomError('You are not authorized to access this route', 401)
    );
  }

  next();
});

module.exports = {
  getAccessToRoute,
  isTheUserRegistered,
};
