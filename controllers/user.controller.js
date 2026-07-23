const userProfile = function (req, res) {
  res.status(200).json({ message: "user" });
};

module.exports = {
  userProfile,
};
