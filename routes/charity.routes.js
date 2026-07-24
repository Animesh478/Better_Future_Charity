const express = require("express");
const { registerCharity } = require("../controllers/charity.controller");

const charityRouter = express.Router();

charityRouter.route("/register").post(registerCharity);

module.exports = charityRouter;
