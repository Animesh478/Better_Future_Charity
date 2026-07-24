const { createCharity } = require("../services/charity.service");

const registerCharity = async function (req, res) {
  const userDetails = req.user; //id, name, email
  console.log("req body=", req.body);
  const charityDetails = req.body;
  try {
    const newCharity = await createCharity(userDetails, charityDetails);
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

module.exports = {
  registerCharity,
};
