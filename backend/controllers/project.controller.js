const {
  createProjectInDb,
  updateProjectInDb,
  fetchProjectDetailsFromDb,
} = require("../services/project.service");

const createProject = async function (req, res) {
  const userId = req.user.id;
  const projectDetails = req.body;

  try {
    const result = await createProjectInDb(userId, projectDetails);
    if (result?.error === "NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: result.message,
      });
    }

    if (result?.error === "NOT_APPROVED") {
      return res.status(403).json({
        success: false,
        message: result.message,
      });
    }

    res.status(201).json({
      success: true,
      data: result.project,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const updateProject = async function (req, res) {
  const userId = req.user.id;
  const projectId = req.params.projectId;
  const updateData = req.body;

  try {
    const result = await updateProjectInDb(userId, projectId, updateData);
    if (result?.error === "NOT_FOUND") {
      res.status(404).json({ success: false, message: result.message });
    }

    res.status(200).json({
      success: true,
      data: result.project,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const fetchProject = async function (req, res) {
  const { projectId } = req.params;
  try {
    const result = await fetchProjectDetailsFromDb(projectId);
    if (result.error) {
      res.status(404).json({ success: false, message: result.message });
    }
    res.status(200).json({ success: true, data: result.project });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  createProject,
  updateProject,
  fetchProject,
};
