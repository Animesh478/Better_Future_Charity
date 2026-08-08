const {
  approveCharityInDb,
  getAllUsersFromDb,
  updateUserRoleInDb,
  getAllCharitiesFromDb,
  updateCharityStatusInDb,
} = require("../services/admin.service");

// User management
const listUsers = async function (req, res) {
  const { page, limit, search } = req.query;
  const parsedPage = parseInt(page) || 1;
  const parsedLimit = parseInt(limit) || 10;
  try {
    const result = await getAllUsersFromDb(parsedPage, parsedLimit, search);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const changeUserRole = async function (req, res) {
  const { userId } = req.params;
  const { targetRole } = req.body;

  try {
    const result = await updateUserRoleInDb(userId, targetRole);
    if (result.error) {
      return res
        .status(result.error === "NOT_FOUND" ? 404 : 400)
        .json({ success: false, message: result.message });
    }
    res
      .status(200)
      .json({ success: true, message: "Role modified successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// Charity management
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

const listCharities = async function (req, res) {
  const { page, limit, search } = req.query;
  const parsedPage = parseInt(page) || 1;
  const parsedLimit = parseInt(limit) || 10;

  try {
    const result = await getAllCharitiesFromDb(parsedPage, parsedLimit, search);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const modifyCharityStatus = async function (req, res) {
  const charityId = req.params.charityId;
  const { targetStatus } = req.body;

  try {
    const result = await updateCharityStatusInDb(charityId, targetStatus);
    if (result.error) {
      res
        .status(result.error === "NOT_FOUND" ? 404 : 400)
        .json({ success: false, message: result.message });
    }
    return res
      .status(200)
      .json({ success: true, message: "Charity status updated successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  approveCharity,
  listUsers,
  changeUserRole,
  listCharities,
  modifyCharityStatus,
};
