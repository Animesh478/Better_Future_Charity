const { approveCharityInDb } = require("../services/admin.service");

const approveCharity = async function (req, res) {
  const charityId = req.params.charityId;
  try {
    const result = await approveCharityInDb(charityId);
    if (result?.error === "NOT_FOUND") {
      res.status(404).json({
        success: false,
        message: result.message,
      });
    }

    if (result?.error === "ALREADY_APPROVED") {
      res.status(400).json({
        success: false,
        message: result.message,
      });
    }

    res.status(200).json({
      success: true,
      message: "Charity approved successfully",
    });
  } catch (error) {
    console.error("Approval Error ", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  approveCharity,
};
