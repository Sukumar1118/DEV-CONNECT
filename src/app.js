const express = require("express");
const DBConnect = require("./config/database");
const app = express();
const User = require("./models/user");
const cookieParser = require("cookie-parser");
const authRouter = require("./routers/auth.router");
const profileRouter = require("./routers/profile.router");
const requestsRouter = require("./routers/requests.router");

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestsRouter);

DBConnect()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.log("Error while connecting to database", err);
  });
