const express = require("express");
require("dotenv").config();

const authRouter = require("./routes/auth.routes");
const userRouter = require("./routes/user.routes");
const authenticateUser = require("./middlewares/auth");
const cookieParser = require("cookie-parser");

const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/user", authenticateUser, userRouter);

app.listen(PORT, () => {
  console.log("Server running on port ", PORT);
});
