const express = require("express");
const authRouter = express.Router();

const { validateSignupData, throwError } = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");

// POST /signup for user creation
authRouter.post("/signup", async (req, res) => {
  try {
    validateSignupData(req);

    const { firstName, lastName, emailId, password, gender, age, hobbies, about, photoUrl } =
      req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      gender,
      age,
      hobbies,
      about,
      photoUrl,
    });

    await user.save();
    res.send("User Added Successfully !!!");
  } catch (error) {
    res.status(400).send("Error : " + error);
  }
});

// POST /login
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    const { firstName, lastName, hobbies, gender, photoUrl, age } = user;
    if (!user) throwError("Invalid credentials");

    const isPassowordValid = await user.validatePassword(password);

    if (isPassowordValid) {
      const token = await user.getJWT();

      res.cookie("token", token);

      res.status(200).json({
        message: "Success",
        user: { firstName, lastName, hobbies, gender, photoUrl, age },
      });
    } else {
      throwError("Invalid credentials");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// POST /logout
authRouter.post("/logout", async (req, res) => {
  res.clearCookie("token", { path: "/" }); // Clear the cookie

  return res.status(200).send("Logout Success");
});

module.exports = authRouter;
