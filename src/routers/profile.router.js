const express = require("express");
const profileRouter = express.Router();
const userAuth = require("../middlewares/auth.middleware");

profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

module.exports = profileRouter;
