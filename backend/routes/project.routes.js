const express = require("express");
const {
  createProject,
  updateProject,
  fetchProject,
} = require("../controllers/project.controller");

const projectRouter = express.Router();

projectRouter.route("/registerProject").post(createProject);
projectRouter.route("/updateProject/:projectId").patch(updateProject);
projectRouter.route("/fetchProject/:projectId").get(fetchProject);

module.exports = projectRouter;
