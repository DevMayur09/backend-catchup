const express = require("express");
const { userAuth } = require("../middlewares/auth");
const connectionRequest = require("../models/connectionRequest");

const userRouter = express.Router();

userRouter.get("/user/requests", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const userRequests = await connectionRequest
      .find({ toUserId: loggedInUser._id, status: "interested" })
      .populate("fromUserId", ["firstName", "lastName"]);
    res.json({ message: "success", data: userRequests });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const userConnections = await connectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUSerId: loggedInUser._id }],
      status: "accepted",
    });

    if (!userConnections) return res.status(400).json({ message: "no connection found" });

    return res.json({ message: "success", data: userConnections });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

module.exports = userRouter;
