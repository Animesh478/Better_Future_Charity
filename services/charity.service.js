const { Charity, User } = require("../models/index");

const createCharity = async function (userDetails, charityDetails) {
  const { name, description, registrationNumber } = charityDetails;
  const userId = userDetails.id;

  try {
    const newCharity = await Charity.create({
      name,
      description,
      registrationNumber,
      userId,
    });

    if (newCharity) return newCharity;
  } catch (err) {
    console.log(err);
    const error = new Error("Charity cannot be created");
    error.statusCode = 500;
    throw error;
  }
};

module.exports = {
  createCharity,
};
