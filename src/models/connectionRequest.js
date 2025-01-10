const mongoose = require("mongoose");

const connectionRequestSchema = mongoose.Schema({
  status: {
    type: String,
    required: true,
    enum: ["interested", "ignored"],
  },
  fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  senderUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

connectionRequestSchema.index({ fromUserId: 1, senderUserId: 1 });

connectionRequestSchema.pre("save", async function (next) {
  const connectionRequest = this;
  if (connectionRequest.fromUserId.equals(connectionRequest.senderUserId)) {
    throw new Error("Cannot send connection request to yourself");
  }
  next();
});

const ConnectionRequest = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);
module.exports = ConnectionRequest;
