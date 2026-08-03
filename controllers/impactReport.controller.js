const {
  createImpactReportInDb,
  getReportsFromDb,
} = require("../services/impactReport.service");

const generateImpactReport = async function (req, res) {
  const userId = req.user.id;
  const projectId = req.params.projectId;

  const reportData = req.body;

  try {
    const result = await createImpactReportInDb(userId, projectId, reportData);

    if (result.error) {
      return res
        .status((result.error = "NOT_FOUND" ? 404 : 403))
        .json({ success: false, message: result.message });
    }

    res.status(201).json({
      success: true,
      data: result.report,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const fetchReports = async function (req, res) {
  const { page, limit } = req.query;
  const parsedPage = parseInt(page) || 1;
  const parsedLimit = parseInt(limit) || 10;

  const { projectId } = req.params;

  try {
    const result = await getReportsFromDb(projectId, parsedPage, parsedLimit);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Fetch reports error", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  generateImpactReport,
  fetchReports,
};
