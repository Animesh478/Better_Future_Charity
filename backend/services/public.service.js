const { Op } = require("sequelize");
const { Charity } = require("../models/index");

const fetchCharitiesFromDb = async function (page = 1, limit = 10, search) {
  const offset = (page - 1) * limit;

  // only show the approved charities
  const whereClause = {
    status: "Approved",
  };

  // add search functionality if search term is provided only
  if (search) {
    whereClause[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { description: { [Op.like]: `%${search}%` } },
    ];
  }

  // query the database
  const { count, rows } = await Charity.findAndCountAll({
    //rows contain the actual data
    where: whereClause,
    limit,
    offset,
    order: [["createdAt", "DESC"]],
    attributes: { exclude: ["userId"] },
  });

  // formatting the response
  return {
    totalItems: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    charities: rows,
  };
};

module.exports = {
  fetchCharitiesFromDb,
};
