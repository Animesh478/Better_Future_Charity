const express = require("express");
const {
  generateImpactReport,
} = require("../controllers/impactReport.controller");

const impactReportRouter = express.Router();

impactReportRouter
  .route("/generate-report/:projectId")
  .post(generateImpactReport);

// impactReportRouter.route("/fetch-reports/:projectId").get(fetchReports);

module.exports = impactReportRouter;
