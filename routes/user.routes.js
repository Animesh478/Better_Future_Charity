const express = require("express");
const { userProfile } = require("../controllers/user.controller");
const userRouter = express.Router();

userRouter.route("/profile").get(userProfile);

module.exports = userRouter;
