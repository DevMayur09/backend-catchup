const express = require("express");
const profileRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const {
  throwError,
  validateEditProfileData,
  validatePasswordResetData,
} = require("../utils/validation");
const bcrypt = require("bcrypt");

// GET /profile/view
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const { firstName, lastName, gender, age, photoUrl, hobbies } = user;
    return res.json({
      message: "Success",
      user: { firstName, lastName, gender, age, photoUrl, hobbies },
    });
  } catch (error) {
    res.status(400).send(`Error: ${error.message}`);
  }
});

// PATCH /profile/edit
profileRouter.patch("/profile/reset-password", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword) throwError("Please Enter old password");

    const validPassword = await loggedInUser.validatePassword(oldPassword);

    if (!validPassword) throwError("Old password is incorrect");

    validatePasswordResetData(req);

    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    loggedInUser.password = newPasswordHash;

    await loggedInUser.save();

    res.json({
      message: loggedInUser.firstName + " your password updated Successfully.",
    });
  } catch (error) {
    res.status(400).send(`Error: ${error.message}`);
  }
});

// PATCH /profile/edit
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const isEditableData = validateEditProfileData(req);
    if (!isEditableData) throwError("Invalid Data");

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
