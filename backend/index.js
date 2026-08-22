const express = require("express");
require("dotenv").config();
const cors = require("cors");

const authRouter = require("./routes/auth.routes");
const userRouter = require("./routes/user.routes");
const charityRouter = require("./routes/charity.routes");
const adminRouter = require("./routes/admin.routes");
const projectRouter = require("./routes/project.routes");
const publicRouter = require("./routes/public.routes");
const donationRouter = require("./routes/donation.routes");
const impactReportRouter = require("./routes/impactReport.routes");

const authenticateUser = require("./middlewares/auth.middleware");
const cookieParser = require("cookie-parser");
const verifyAdmin = require("./middlewares/admin.middleware");
const { handleWebhook } = require("./controllers/donation.controller");

const PORT = process.env.PORT;
const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.post(
  "/api/donations/webhook",
  express.raw({ type: "application/json" }),
  handleWebhook,
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/user", authenticateUser, userRouter);
app.use("/api/charity", authenticateUser, charityRouter);
app.use("/api/admin", authenticateUser, verifyAdmin, adminRouter);
app.use("/api/project", authenticateUser, projectRouter);
app.use("/api/public", publicRouter);
app.use("/api/donations", donationRouter);
app.use("/api/reports", authenticateUser, impactReportRouter);

app.listen(PORT, () => {
  console.log("Server running on port ", PORT);
});
