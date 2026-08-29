const { Op } = require("sequelize");
const { Charity, User, Project } = require("../models/index");

const createCharityInDb = async function (userDetails, charityDetails) {
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

const updateCharityInDb = async function (userId, updateData) {
  const charity = await Charity.findOne({
    where: {
      userId,
    },
  });

  if (!charity) {
    return {
      error: "NOT_FOUND",
      message: "The user does not have any charity",
    };
  }

  const safeUpdateData = {};

  if (updateData.description !== undefined) {
    safeUpdateData.description = updateData.description;
  }

  await charity.update(safeUpdateData);

  return { charity };
};

const fetchMyCharityFromDb = async function (userId) {
  const charity = await Charity.findOne({
    where: {
      userId,
    },
    include: [
      {
        model: Project,
        as: "projects",
        attributes: [
          "id",
          "title",
          "description",
          "goalAmount",
          "raisedAmount",
          "status",
          "createdAt",
        ],
      },
    ],
  });
  if (!charity) {
    return {
      error: "NOT_FOUND",
      message: "Charity not found or you have not registered a charity yet",
    };
  }
  return { charity };
};

module.exports = {
  createCharityInDb,
  updateCharityInDb,
  fetchMyCharityFromDb,
};
