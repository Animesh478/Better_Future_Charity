const express = require("express");
const {
  approveCharity,
  listUsers,
  changeUserRole,
} = require("../controllers/admin.controller");

const adminRouter = express.Router();

adminRouter.route("/charity/:charityId/approve").patch(approveCharity);
adminRouter.route("/users").get(listUsers);
adminRouter.route("/users/:userId/role").patch(changeUserRole);

module.exports = adminRouter;
