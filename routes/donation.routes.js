const express = require("express");
const {
  makeDonation,
  handleReturn,
  getDonationHistory,
} = require("../controllers/donation.controller");
const authenticateUser = require("../middlewares/auth.middleware");

const donationRouter = express.Router();

donationRouter.route("/checkout").post(authenticateUser, makeDonation);
donationRouter.route("/my-donations").get(authenticateUser, getDonationHistory);
donationRouter.route("/verify").get(handleReturn);

module.exports = donationRouter;
