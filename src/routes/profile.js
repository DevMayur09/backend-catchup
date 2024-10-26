const express = require("express");
const profileRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const { throwError, validateEditProfileData } = require("../utils/validation");

// GET /profile/view
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const userName = user.firstName;

    res.send("Hello " + userName);
  } catch (error) {
    res.status(400).send(`Error: ${error.message}`);
  }
});

// PATCH /profile/edit
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) throwError("Invalid edit request");

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    });

    await loggedInUser.save();

    res.json({
      message: loggedInUser.firstName + " your profile updated successfully",
      data: loggedInUser,
    });
  } catch (error) {
    res.status(400).send(`Error: ${error.message}`);
  }
});
module.exports = profileRouter;
