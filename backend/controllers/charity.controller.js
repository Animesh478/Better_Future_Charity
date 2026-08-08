const {
  createCharityInDb,
  updateCharityInDb,
} = require("../services/charity.service");

const registerCharity = async function (req, res) {
  const userDetails = req.user; //id, name, email
  console.log("req body=", req.body);
  const charityDetails = req.body;
  try {
    const newCharity = await createCharityInDb(userDetails, charityDetails);
    return res.status(201).json({
      success: true,
      message: "Charity created successfully. It is now pending Admin approval",
      data: newCharity,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: `${error.message}`,
    });
  }
};

const updateCharity = async function (req, res) {
  const userId = req.user.id;
  const updateData = req.body;

  try {
    const result = await updateCharityInDb(userId, updateData);
    if (result?.error === "NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: result.message,
      });
    }

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  registerCharity,
  updateCharity,
};
