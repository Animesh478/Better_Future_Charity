const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET_KEY;

const createToken = function (payload) {
  return jwt.sign(payload, secretKey, {
    expiresIn: "1d",
  });
};

const verifyToken = function (token) {
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (error) {
    console.log("Invalid token");
  }
};

module.exports = {
  createToken,
  verifyToken,
};
