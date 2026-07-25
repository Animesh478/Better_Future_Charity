const { Charity, User, sequelize } = require("../models/index");

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

module.exports = {
  approveCharityInDb,
};
