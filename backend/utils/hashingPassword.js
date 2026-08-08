const bcrypt = require("bcrypt");

const createHashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

const comparePassword = async function (password, passwordHash) {
  return await bcrypt.compare(password, passwordHash);
};

module.exports = {
  createHashPassword,
  comparePassword,
};
