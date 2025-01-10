const express = require("express");
const profileRouter = express.Router();
const userAuth = require("../middlewares/auth.middleware");
const {
  validateUserProfileEditData,
  validatePasswordChangeData,
} = require("../utils/user.utils");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

profileRouter.patch("/profile/update", userAuth, async (req, res) => {
  try {
    const isProfileUpdateValid = validateUserProfileEditData(req.body);
    if (!isProfileUpdateValid) {
      return res.status(400).send("Invalid updates");
    }
    const loggedUser = req.user;
    Object.keys(req.body).forEach((key) => {
      loggedUser[key] = req.body[key];
    });
    await loggedUser.save();
    res.status(200).send(loggedUser);
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

profileRouter.post("/profile/password", userAuth, async (req, res) => {
  try {
    const loggedUser = req.user;
    const newPassword = req.body.password;
    const isMatch = await validatePasswordChangeData(newPassword, req.user);
    if (!isMatch) {
      return res.status(400).send("Invalid password");
    }
    loggedUser.password = newPassword;
    await loggedUser.save();
    res.status(200).send("Password changed successfully");
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

module.exports = profileRouter;
