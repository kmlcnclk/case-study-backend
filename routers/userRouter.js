const { Router } = require('express');
const {
  login,
  register,
  userUpdate,
  userinfo,
  contact,
  logout,
} = require('../controllers/userController');
const {
  isTheUserRegistered,
  getAccessToRoute,
} = require('../middlewares/auth/auth');
const { isFieldExist } = require('../middlewares/contact');

const userRouter = Router();

userRouter.post('/register', [isTheUserRegistered], register);

userRouter.post('/login', login);

userRouter.get('/userinfo', [getAccessToRoute], userinfo);

userRouter.put('/update', [getAccessToRoute], userUpdate);

// buna bak
userRouter.get('/logout', [getAccessToRoute], logout);
userRouter.post('/contact', [isFieldExist], contact);

module.exports = userRouter;
