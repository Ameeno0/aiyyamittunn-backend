const express = require('express');
const itemRouter = express.Router();
const { itemLogics } = require('../logics');

const handleRequest = (fn) => (req, res) =>
  fn({
    params: req.params,
    body: req.body,
    query: req.query,
  })
    .then((data) => res.status(200).json(data))
    .catch((err) => {
      res.status(400).json(err);
    });

itemRouter.get('/', handleRequest(itemLogics.rest.getAllItems));
itemRouter.get('/getOne/:id', handleRequest(itemLogics.rest.getOneItem));
itemRouter.post('/add', handleRequest(itemLogics.rest.addNewItem));
itemRouter.patch('/update', handleRequest(itemLogics.rest.updateItem));

module.exports = itemRouter;
