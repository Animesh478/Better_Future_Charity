const express = require("express");
const { approveCharity } = require("../controllers/admin.controller");

const adminRouter = express.Router();

adminRouter.route("/charity/:charityId/approve").patch(approveCharity);

module.exports = adminRouter;
