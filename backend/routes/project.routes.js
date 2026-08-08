const express = require("express");
const {
  createProject,
  updateProject,
} = require("../controllers/project.controller");

const projectRouter = express.Router();

projectRouter.route("/registerProject").post(createProject);
projectRouter.route("/updateProject/:projectId").patch(updateProject);

module.exports = projectRouter;
