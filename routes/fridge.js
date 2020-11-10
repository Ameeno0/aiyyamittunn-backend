const express = require('express');
const fridgeRouter = express.Router();
const { fridgeLogics } = require('../logics');

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

fridgeRouter.get('/', handleRequest(fridgeLogics.rest.restGetAll));
fridgeRouter.get(
  '/location',
  handleRequest(fridgeLogics.rest.restGetBasedOnLocation)
);
fridgeRouter.post('/create', handleRequest(fridgeLogics.rest.createFridge));

module.exports = fridgeRouter;
