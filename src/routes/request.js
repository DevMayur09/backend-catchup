const express = require("express");
const requestRouter = express.Router();

const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const { throwError } = require("../utils/validation");
const ConnectionRequest = require("../models/connectionRequest");

// POST send request that could be either interested or ignored.
requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const fromUserId = loggedInUser._id;
    const { toUserId, status } = req.params;

    const allowedStatus = ["ignored", "interested"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: `Invalid status type : ${status}`,
      });
    }

    const toUser = await User.findById({ _id: toUserId });
    if (!toUser) {
      return res.status(400).json({
        message: "Sending request to unknown user",
      });
    }

    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    if (existingConnectionRequest) {
      return res.status(400).json({
        message: "Connection already exist",
      });
    }

    const connectionRequest = new ConnectionRequest({ fromUserId, toUserId, status });

    const data = await connectionRequest.save();

    return res.status(200).json({
      message: "Connection request send successfully.",
      data: {
        fromUser: loggedInUser.firstName,
        toUSer: toUser.firstName,
        fromUserId,
        toUserId,
        status,
      },
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

// POST review request that could be either accepted or rejected.
requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { status, requestId } = req.params;

    const allowedStatus = ["accepted", "rejected"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: `Invalid status type: ${status}`,
      });
    }

    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: "interested",
    });

    if (!connectionRequest)
      return res.status(404).json({ message: "connection request not found" });

    const { fromUserId } = connectionRequest;
    const fromUser = await User.findById({ _id: fromUserId });

    const { firstName } = fromUser;
    connectionRequest.status = status;

    const data = await connectionRequest.save();

    return res.json({
      message: `You have ${status} connection request`,
      data: {
        fromUser: firstName,
        toUser: loggedInUser.firstName,
        status: status,
      },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /feed for gettings feeds of users
requestRouter.get("/feeds", userAuth, async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

module.exports = requestRouter;
