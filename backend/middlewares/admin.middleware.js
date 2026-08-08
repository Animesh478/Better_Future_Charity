const verifyAdmin = function (req, res, next) {
  if (req.user && req.user.role === "Admin") {
    next();
  } else {
    res
      .status(403)
      .json({ success: false, message: "Forbidden. Admin access required" });
  }
};

module.exports = verifyAdmin;
