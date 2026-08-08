const express = require("express");
const {
  generateImpactReport,
} = require("../controllers/impactReport.controller");

const impactReportRouter = express.Router();

impactReportRouter
  .route("/generate-report/:projectId")
  .post(generateImpactReport);

module.exports = impactReportRouter;
