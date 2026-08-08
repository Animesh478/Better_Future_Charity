const express = require("express");
const {
  approveCharity,
  listUsers,
  changeUserRole,
  listCharities,
  modifyCharityStatus,
} = require("../controllers/admin.controller");

const adminRouter = express.Router();

adminRouter.route("/charity/:charityId/approve").patch(approveCharity);
adminRouter.route("/users").get(listUsers);
adminRouter.route("/users/:userId/role").patch(changeUserRole);
adminRouter.route("/charities").get(listCharities);
adminRouter
  .route("/charity/:charityId/modify-status")
  .patch(modifyCharityStatus);

module.exports = adminRouter;
