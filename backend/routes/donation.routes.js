const express = require("express");
const {
  makeDonation,
  getDonationHistory,
  fetchDonationReceipt,
  fetchDonationStatus,
} = require("../controllers/donation.controller");
const authenticateUser = require("../middlewares/auth.middleware");

const donationRouter = express.Router();

donationRouter.route("/checkout").post(authenticateUser, makeDonation);
donationRouter.route("/my-donations").get(authenticateUser, getDonationHistory);
donationRouter
  .route("/check-status")
  .get(authenticateUser, fetchDonationStatus);
// donationRouter.route("/verify").get(handleReturn);
donationRouter
  .route("/receipts/:donationId")
  .get(authenticateUser, fetchDonationReceipt);

module.exports = donationRouter;
