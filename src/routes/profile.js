const express = require("express");
const profileRouter = express.Router();

const { userAuth } = require("../middlewares/auth");

// GET /profile
profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const userName = user.firstName;

    res.send("Hello " + userName);
  } catch (error) {
    res.status(400).send(`Error: ${error.message}`);
  }
});

module.exports = profileRouter;
