const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

const userRouter = express.Router();

userRouter.get("/user/requests", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const userRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", ["firstName", "lastName"]);
    res.json({ message: "success", data: userRequests });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const userConnections = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    }).populate("fromUserId", ["firstName", "lastName"]);

    if (!userConnections) return res.status(400).json({ message: "no connection found" });

    return res.json({ message: "success", data: userConnections });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

userRouter.get("/user/feeds", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    })
      .select("fromUserId toUserId")
      .populate("fromUserId", ["firstName"])
      .populate("toUserId", ["firstName"]);

    console.log(connectionRequest);
    // self
    // connections
    // requests
    // user
    res.json({ message: "Success !!" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = userRouter;
