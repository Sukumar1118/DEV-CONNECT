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

requestsRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ messaage: "Status not allowed!" });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });
      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: "Connection request not found" });
      }

      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.json({ message: "Connection request " + status, data });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  }
);

module.exports = requestsRouter;
