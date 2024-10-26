const express = require("express");
const requestRouter = express.Router();

const User = require("../models/user");

// GET /feed for gettings feeds
requestRouter.get("/feeds", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    res.status(400).send("Something went wrong...");
  }
});

module.exports = requestRouter;
