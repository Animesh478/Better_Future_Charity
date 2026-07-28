const { fetchCharitiesFromDb } = require("../services/public.service");

const fetchCharities = async function (req, res) {
  const { page, limit, search } = req.query;
  const parsedPage = parseInt(page);
  const parsedLimit = parseInt(limit);

  try {
    const result = await fetchCharitiesFromDb(parsedPage, parsedLimit, search);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error fetching Charities", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  fetchCharities,
};
