const express = require("express");
const {
  fetchCharities,
  fetchCharity,
} = require("../controllers/public.controller");
const { fetchReports } = require("../controllers/impactReport.controller");

const publicRouter = express.Router();

publicRouter.route("/charities").get(fetchCharities);
publicRouter.route("/charity/:charityId").get(fetchCharity);
publicRouter.route("/projects/:projectId/reports").get(fetchReports);

module.exports = publicRouter;
