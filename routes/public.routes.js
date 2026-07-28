const express = require("express");
const { fetchCharities } = require("../controllers/public.controller");

const publicRouter = express.Router();

publicRouter.route("/charities").get(fetchCharities);

module.exports = publicRouter;
