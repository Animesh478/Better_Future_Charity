const express = require("express");
const { signup, login, logout } = require("../controllers/auth.controller");
const authRouter = express.Router();

authRouter.route("/signup").post(signup);
authRouter.route("/login").post(login);
authRouter.route("/logout").post(logout);

module.exports = authRouter;
