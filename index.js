const express = require("express");
require("dotenv").config();

const userRouter = require("./routes/user.routes");

const PORT = process.env.PORT;
const app = express();

app.use(express.json());

app.use("/user", userRouter);

express.listen(PORT, () => {
  console.log("Server running on port ", PORT);
});
