const { Project, Charity } = require("../models/index");

const createProjectInDb = async function (userId, projectDetails) {
  // first fetch the charity owned by the current user

  const charity = await Charity.findOne({
    where: {
      userId,
    },
  });

  if (!charity) {
    return {
      error: "NOT_FOUND",
      message: "Charity profile not found",
    };
  }

  // check if the charity is approved
  if (charity.status !== "Approved") {
    return {
      error: "NOT_APPROVED",
      message: "Charity needs to be approved to create a project",
    };
  }

  const newProject = await Project.create({
    title: projectDetails.title,
    description: projectDetails.description,
    goalAmount: projectDetails.goalAmount,
    charityId: charity.id,
  });

  return { success: true, project: newProject };
};

const updateProjectInDb = async function (userId, projectId, updateData) {
  const charity = await Charity.findOne({
    where: {
      userId,
    },
  });

  if (!charity) {
    return {
      error: "NOT_FOUND",
      message: "Charity profile not found",
    };
  }

  // find the project and ensure it belongs to the correct charity
  const project = await Project.findOne({
    where: {
      id: projectId,
      charityId: charity.id,
    },
  });

  if (!project) {
    return {
      error: "NOT_FOUND",
      message: "Project not found or you do not have permission to edit it",
    };
  }

  const safeUpdateData = {}; // we only add those data to this object that can be updated
  // We explicitly check for undefined so we only update fields the user actually sent in the PATCH request
  if (updateData.description !== undefined) {
    safeUpdateData.description = updateData.description;
  }

  if (updateData.goalAmount !== undefined) {
    safeUpdateData.goalAmount = updateData.goalAmount;
  }

  if (updateData.status !== undefined) {
    safeUpdateData.status = updateData.status;
  }

  await project.update(safeUpdateData);

  return {
    success: true,
    project,
  };
};

module.exports = {
  createProjectInDb,
  updateProjectInDb,
};
