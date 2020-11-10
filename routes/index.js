const express = require('express');
const apiRouter = express.Router();
const userRouter = require('./user');
const fridgeRouter = require('./fridge');
const itemRouter = require('./items');
const countRouter = require('./counts');

apiRouter.use('/user', userRouter);
apiRouter.use('/fridge', fridgeRouter);
apiRouter.use('/item', itemRouter);
apiRouter.use('/count', countRouter);

module.exports = apiRouter;
