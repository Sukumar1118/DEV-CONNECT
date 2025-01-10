const express = require("express");
const requestsRouter = express.Router();
const userAuth = require("../middlewares/auth.middleware");

requestsRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.status(200).send("Connection request sent successfully");
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

module.exports = requestsRouter;