const { registerUser, loginUser } = require("../services/auth.service");

const signup = async function (req, res) {
  const userDetails = req.body;
  try {
    const newUser = await registerUser(userDetails);
    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    console.error(error);
    res
      .status(401)
      .json({ message: "Registration failed. Account cannot be created" });
  }
};

const login = async function (req, res) {
  const userCredentials = req.body;
  try {
    const token = await loginUser(userCredentials);
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Login failed" });
  }
};

module.exports = {
  signup,
  login,
};
