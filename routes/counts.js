const express = require('express');
const countRouter = express.Router();
const { userModel, fridgeModel, itemsModel } = require('../models');

countRouter.get('/', async (req, res) => {
  const users = await userModel.count();
  const fridges = await fridgeModel.count();
  const items = await itemsModel.count();

  res.status(200).json({
    users,
    fridges,
    items,
  });
});

module.exports = countRouter;
