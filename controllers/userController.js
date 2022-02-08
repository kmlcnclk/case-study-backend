const User = require('../databases/models/UserModel');
const {
  validateUserInput,
  comparePassword,
} = require('../helpers/input/inputHelpers');
const { sendJwtToClient } = require('../helpers/auth/tokenHelpers');
const expressAsyncHandler = require('express-async-handler');
const CustomError = require('../errors/CustomError');
const sendEmail = require('../helpers/libraries/sendEmail');
const UserModel = require('../databases/models/UserModel');

// Register
const register = expressAsyncHandler(async (req, res, next) => {
  const { email, password, name } = req.body;

  const user = await User.create({
    email,
    password,
    name,
  });

  sendJwtToClient(user, res, 'register');
});

const login = expressAsyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!validateUserInput(email, password)) {
    return next(new CustomError('Please check your Inputs', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!comparePassword(password, user.password)) {
    return next(new CustomError('Please check your credentials', 400));
  }

  sendJwtToClient(user, res, 'login');
});

const userUpdate = expressAsyncHandler(async (req, res, next) => {
  const { email, password, name } = req.body;
  const { id } = req.user;

  const user = await User.findById(id);

  if (!user) {
    return next(new CustomError('User not found', 404));
  }

  if (email) {
    user.email = await email;
  }
  if (name) {
    user.name = await name;
  }
  if (password) {
    user.password = await password;
  }

  if (email || name || password) {
    await user.save();
  }

  return res.status(200).json({
    success: true,
    message: 'User updated successfully',
  });
});

const userinfo = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.user;

  const user = await User.findById(id);

  if (!user) {
    return next(new CustomError('User not found', 404));
  }

  return res.status(200).json({
    success: true,
    data: user,
  });
});

const contact = expressAsyncHandler(async (req, res, next) => {
  const { email, name, country, message } = req.body;

  const user = await UserModel.findOne({ email });

  if (!user) {
    return next(new CustomError('User not found', 404));
  }

  const emailTemplate = `
      <div>
      <h3>${name}</h3>
      <div>
          ${message}
      </div>
      <br/>
      <div>
          ${country}
      </div>
      </div>
    `;

  try {
    await sendEmail({
      to: process.env.SMTP_USER,
      from: email,
      subject: name,
      html: emailTemplate,
    });

    return res.status(200).json({
      success: true,
      message: 'Email sent successfully',
    });
  } catch (err) {
    return next(new CustomError('Email cloud not be sent', 500));
  }
});

// Logout
const logout = expressAsyncHandler(async (req, res, next) => {
  const { NODE_ENV } = process.env;

  return res
    .status(200)
    .cookie({
      httpOnly: true,
      expires: new Date(Date.now()),
      secure: NODE_ENV === 'development' ? false : true,
    })
    .json({
      success: true,
      message: 'Logout Successful',
    });
});

module.exports = {
  login,
  register,
  userUpdate,
  userinfo,
  contact,
  logout,
};
