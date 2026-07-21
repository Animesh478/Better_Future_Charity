const express = require("express");
const userRouter = express.Router();

userRouter.route("/signup").post();
userRouter.route("/login").post();

module.exports = userRouter;
