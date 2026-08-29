const express = require("express");
const {
  registerCharity,
  updateCharity,
  fetchMyCharity,
} = require("../controllers/charity.controller");

const charityRouter = express.Router();

charityRouter.route("/register").post(registerCharity);
charityRouter.route("/update").patch(updateCharity);
charityRouter.route("/me").get(fetchMyCharity);

module.exports = charityRouter;
