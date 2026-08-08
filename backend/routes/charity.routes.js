const express = require("express");
const {
  registerCharity,
  updateCharity,
} = require("../controllers/charity.controller");

const charityRouter = express.Router();

charityRouter.route("/register").post(registerCharity);
charityRouter.route("/update").patch(updateCharity);

module.exports = charityRouter;
