const {
  fetchCharitiesFromDb,
  fetchCharityFromDb,
} = require("../services/public.service");

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

const fetchCharity = async function (req, res) {
  const { charityId } = req.params;
  try {
    const result = await fetchCharityFromDb(charityId);

    if (result.error) {
      return res.status(404).json({ success: false, message: result.message });
    }
    res.status(200).json({
      success: true,
      data: result.charity,
    });
  } catch (error) {
    console.error("Error fetching the charity", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  fetchCharities,
  fetchCharity,
};
