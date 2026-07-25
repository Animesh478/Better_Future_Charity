const express = require("express");
require("dotenv").config();

const authRouter = require("./routes/auth.routes");
const userRouter = require("./routes/user.routes");
const charityRouter = require("./routes/charity.routes");
const adminRouter = require("./routes/admin.routes");
const authenticateUser = require("./middlewares/auth.middleware");
const cookieParser = require("cookie-parser");
const verifyAdmin = require("./middlewares/admin.middleware");

const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/user", authenticateUser, userRouter);
app.use("/api/charity", authenticateUser, charityRouter);
app.use("/api/admin", authenticateUser, verifyAdmin, adminRouter);

app.listen(PORT, () => {
  console.log("Server running on port ", PORT);
});
