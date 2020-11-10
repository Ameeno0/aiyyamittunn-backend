const express = require("express");
const userRouter = express.Router();
const { userLogics } = require("../logics");

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

userRouter.get("/", handleRequest(userLogics.rest.restGetAll));
userRouter.get("/:pkid", handleRequest(userLogics.rest.restGetOne));
userRouter.post("/create", handleRequest(userLogics.rest.createNewUser));
userRouter.post("/login", handleRequest(userLogics.rest.loginUser));
userRouter.patch("/promoteUser", handleRequest(userLogics.rest.promoteUser));
userRouter.patch("/update/:pkid", handleRequest(userLogics.rest.updateUser));

module.exports = userRouter;
