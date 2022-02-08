const { Router } = require('express');
const userRouter = require('./userRouter');

const mainRouter = Router();

mainRouter.use('/user', userRouter);

module.exports = mainRouter;
