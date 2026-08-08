const { User } = require("../models/index");
const {
  createHashPassword,
  comparePassword,
} = require("../utils/hashingPassword");
const { createToken } = require("../utils/jwt");

const registerUser = async function (userDetails) {
  const { name, email, password, phoneNumber, role } = userDetails;
  const passwordHash = await createHashPassword(password);
  console.log("password hash=", passwordHash);

  const newUser = await User.create({
    name,
    email,
    passwordHash,
    phoneNumber,
    role,
  });

  if (newUser) return newUser;
  throw new Error("User cannot be created");
};

const loginUser = async function (userCredentials) {
  const { email, password } = userCredentials;
  const existingUser = await User.findOne({
    where: {
      email,
    },
  });

  if (!existingUser) {
    const error = new Error("Incorrect Credentials. User does not exist");
    error.statusCode = 401;
    throw error;
  }

  // compare password
  const passwordHash = existingUser.passwordHash;
  const isMatch = await comparePassword(password, passwordHash);
  if (!isMatch) {
    const error = new Error("Incorrect Credentials");
    error.statusCode = 401;
    throw error;
  }

  // if user credentials match, create a jwt token
  const payload = {
    id: existingUser.id,
    name: existingUser.name,
    email: existingUser.email,
    role: existingUser.role,
  };
  const token = createToken(payload);
  return token;
};

module.exports = {
  registerUser,
  loginUser,
};
