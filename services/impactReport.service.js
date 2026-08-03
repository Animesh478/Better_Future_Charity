const { Project, Charity, ImpactReport } = require("../models/index");

const createImpactReportInDb = async function (userId, projectId, reportData) {
  const charity = await Charity.findOne({
    where: {
      userId,
    },
  });

  if (!charity) {
    return { error: "NOT_FOUND", message: "User does not own any charity" };
  }

  const project = await Project.findOne({
    where: {
      id: projectId,
      charityId: charity.id,
    },
  });

  // this project does not belongs to the charity owned by the current user. so he is forbidden to create a report
  if (!project) {
    return {
      error: "FORBIDDEN",
      message: "You do not have permission to post updates on this project",
    };
  }

  // create a report if everything is fine
  const report = await ImpactReport.create({
    projectId,
    title: reportData.title,
    content: reportData.content,
    fundsUtilized: reportData.fundsUtilized,
  });

  return { report };
};

const getReportsFromDb = async function (projectId, page = 1, limit = 10) {
  const offset = (page - 1) * limit;

  const { count, rows } = await ImpactReport.findAndCountAll({
    where: {
      projectId,
    },
    order: [["createdAt", "DESC"]],
    limit,
    offset,
  });

  return {
    totalItems: count,
    page,
    reports: rows,
  };
};

module.exports = {
  createImpactReportInDb,
  getReportsFromDb,
};
