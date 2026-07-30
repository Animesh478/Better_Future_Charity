const express = require("express");
const {
  userProfile,
  updateProfile,
} = require("../controllers/user.controller");
const userRouter = express.Router();

userRouter.route("/profile").get(userProfile);
userRouter.route("/update-profile").patch(updateProfile);

module.exports = userRouter;
