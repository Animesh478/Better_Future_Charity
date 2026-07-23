const { verifyToken } = require("../utils/jwt");

const authenticateUser = function (req, res, next) {
  const token = req.cookies.access_token;
  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (error) {
    // if token has expired
    res.clearCookie("access_token");
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = authenticateUser;
