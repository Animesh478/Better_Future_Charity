const express = require("express");
const { approveCharity } = require("../controllers/admin.controller");

const adminRouter = express.Router();

adminRouter.route("/charity/:id/approve").patch(approveCharity);

module.exports = adminRouter;
