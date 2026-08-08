const {
  updateProfileInDb,
  getUserProfileFromDb,
} = require("../services/user.service");

const userProfile = async function (req, res) {
  const userId = req.user.id;
  try {
    const result = await getUserProfileFromDb(userId);
    if (result?.error === "NOT_FOUND") {
      return res.status(404).json({ success: false, message: result.message });
    }
    res.status(200).json({ success: true, data: result.user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const updateProfile = async function (req, res) {
  const userId = req.user.id;
  const userDetails = req.body;

  try {
    const result = await updateProfileInDb(userId, userDetails);

    if (result?.error === "NOT_FOUND") {
      return res.status(404).json({ success: false, message: result.message });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: result.user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  userProfile,
  updateProfile,
};
