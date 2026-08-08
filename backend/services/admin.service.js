const { Op } = require("sequelize");
const { Charity, User, sequelize } = require("../models/index");

// User management
const getAllUsersFromDb = async function (page = 1, limit = 10, search) {
  // console.log("admin service, page=", page);
  const offset = (page - 1) * limit;
  const whereClause = {};

  if (search) {
    whereClause[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { email: { [Op.like]: `%${search}%` } },
    ];
  }

  const { count, rows } = await User.findAndCountAll({
    where: whereClause,
    limit,
    offset,
    attributes: { exclude: ["passwordHash"] },
    order: [["createdAt", "DESC"]],
  });

  return {
    totalItems: count,
    currentPage: page,
    users: rows,
  };
};

const updateUserRoleInDb = async function (userId, targetRole) {
  const user = await User.findByPk(userId);
  if (!user) return { error: "NOT_FOUND", message: "User not found" };

  const validRoles = ["Donor", "Charity", "Admin"];
  if (!validRoles.includes(targetRole)) {
    return {
      error: "BAD_REQUEST",
      message: "Invalid target role assignment specified.",
    };
  }

  await user.update({ role: targetRole });
  return { user };
};

// Charity management
const approveCharityInDb = async function (charityId) {
  const t = await sequelize.transaction();
  try {
    const charity = await Charity.findByPk(charityId, { transaction: t });

    if (!charity) {
      await t.rollback();
      return { error: "NOT_FOUND", message: "Charity not found" };
    }

    if (charity.status === "Approved") {
      await t.rollback();
      return { error: "ALREADY_APPROVED", message: "Charity already approved" };
    }

    // update the charity status
    await charity.update(
      {
        status: "Approved",
      },
      { transaction: t },
    );

    // update the status of the user
    await User.update(
      {
        role: "Charity",
      },
      {
        where: {
          id: charity.userId,
        },
        transaction: t,
      },
    );

    // commit the transaction
    await t.commit();
    return { success: true };
  } catch (error) {
    console.error(error.message);
    await t.rollback();
    throw error;
  }
};

const getAllCharitiesFromDb = async function (page = 1, limit = 10, search) {
  const offset = (page - 1) * limit;
  const whereClause = {};

  if (search) {
    whereClause[Op.or] = [
      {
        name: { [Op.like]: `%${search}%` },
      },
      {
        description: { [Op.like]: `%${search}%` },
      },
    ];
  }

  const { count, rows } = await Charity.findAndCountAll({
    where: whereClause,
    limit,
    offset,
    order: [["createdAt", "DESC"]],
    include: [
      {
        model: User,
        as: "owner",
        attributes: ["name", "email", "role"],
      },
    ],
  });

  return { currentPage: page, charities: rows, totalItems: count };
};

const updateCharityStatusInDb = async function (charityId, targetStatus) {
  const t = await sequelize.transaction();
  try {
    const charity = await Charity.findByPk(charityId, { transaction: t });

    if (!charity) {
      await t.rollback();
      return { error: "NOT_FOUND", message: "Charity record not found" };
    }

    const validStatus = ["Pending", "Approved", "Rejected", "Suspended"];
    if (!validStatus.includes(targetStatus)) {
      await t.rollback();
      return {
        error: "BAD_REQUEST",
        message: "Invalid status specified.",
      };
    }

    await charity.update(
      {
        status: targetStatus,
      },
      {
        transaction: t,
      },
    );

    // if a charity org is suspended, the user status also needs to change
    if (targetStatus === "Suspended") {
      await User.update(
        { role: "Donor" },
        { where: { id: charity.userId }, transaction: t },
      );
    }

    await t.commit();
    return { charity };
  } catch (error) {
    console.error(error);
    await t.rollback();
    throw error;
  }
};

module.exports = {
  approveCharityInDb,
  getAllUsersFromDb,
  updateUserRoleInDb,
  getAllCharitiesFromDb,
  updateCharityStatusInDb,
};
