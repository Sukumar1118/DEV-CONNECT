const express = require("express");
const requestsRouter = express.Router();
const userAuth = require("../middlewares/auth.middleware");
const connectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

requestsRouter.post(
  "/sendConnectionRequest/:status/:userId",
  userAuth,
  async (req, res) => {
    try {
      const user = req.user;
      const status = req.params.status;
      const senderUserId = req.params.userId;
      const allowedStatus = ["interested", "ignored"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).send("Invalid status");
      }
      const senderUserDetails = await User.findById(senderUserId);
      if (!senderUserDetails) {
        res.status(400).json({ message: "User not found" });
      }
      const isConnectionRequestExists = await connectionRequest.findOne({
        $or: [
          { fromUserId: user._id, senderUserId },
          { fromUserId: senderUserId, senderUserId: user._id },
        ],
      });
      if (isConnectionRequestExists) {
        return res.status(400).send("Connection request already exists");
      }
      const fromUserId = user._id;
      const newConnectionRequest = new connectionRequest({
        status,
        fromUserId,
        senderUserId,
      });
      await newConnectionRequest.save();
      res.status(200).send("Connection request sent successfully");
    } catch (error) {
      res.status(400).send("ERROR: " + error.message);
    }
  }
);

module.exports = requestsRouter;
