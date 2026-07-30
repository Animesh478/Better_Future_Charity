const express = require("express");
const {
  makeDonation,
  handleReturn,
} = require("../controllers/donation.controller");
const authenticateUser = require("../middlewares/auth.middleware");

const donationRouter = express.Router();

donationRouter.route("/checkout").post(authenticateUser, makeDonation);
donationRouter.route("/verify").get(handleReturn);

module.exports = donationRouter;
