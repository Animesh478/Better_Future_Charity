const { User } = require("../models/index");

const getUserProfileFromDb = async function (userId) {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ["passwordHash"] },
  });

  if (!user) return { error: "NOT_FOUND", message: "User not found." };

  return { user };
};

const updateProfileInDb = async function (userId, userDetails) {
  const user = await User.findByPk(userId);
  if (!user) {
    return {
      error: "NOT_FOUND",
      message: "User profile not found",
    };
  }

  const safeUpdateData = {};
  if (userDetails.name !== undefined) {
    safeUpdateData.name = userDetails.name;
  }
  if (userDetails.phoneNumber !== undefined) {
    safeUpdateData.phoneNumber = userDetails.phoneNumber;
  }

  await user.update(safeUpdateData);

  //send the data back to client
  // first we have to remove the password from the user data
  const sanitizedUser = user.toJSON();
  delete sanitizedUser.passwordHash;

  return { user: sanitizedUser };
};

module.exports = {
  updateProfileInDb,
  getUserProfileFromDb,
};
