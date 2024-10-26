const express = require("express");
const connectDB = require("./config/database.js");
const cookieParser = require("cookie-parser");
const User = require("./models/user.js");
const app = express();
const user = require("./models/user.js");
const bcrypt = require("bcrypt");
const { userAuth } = require("./middlewares/auth");
const { validateSignupData, throwError } = require("./utils/validation.js");
const jwt = require("jsonwebtoken");

app.use(express.json());
app.use(cookieParser());

const PORT = 3000;

// POST /signup for user creation
app.post("/signup", async (req, res) => {
  try {
    validateSignupData(req);

    const { firstName, lastName, emailId, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await user.save();
    res.send("User Added Successfully !!!");
  } catch (error) {
    res.status(400).send("Error : " + error);
  }
});

// POST /login
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });

    if (!user) throwError("Invalid credentials");

    const isPassowordValid = await bcrypt.compare(password, user.password);

    if (isPassowordValid) {
      const token = await jwt.sign({ _id: user._id }, "CatchUpSecretJwtKey", { expiresIn: "1d" });
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 360000),
      });
      res.send("login Successful.");
    } else {
      throwError("Invalid credentials pass");
    }
  } catch (error) {
    res.status(400).send("Error: " + error);
  }
});

// GET /profile
app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const userName = user.firstName;
    console.log(`Hello ${userName}`);
    res.send("Get Profile successfully");
  } catch (error) {
    res.status(400).send(`Error: ${error.message}`);
  }
});

// GET /feed for gettings feeds
app.get("/feeds", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    res.status(400).send("Something went wrong...");
  }
});

app.get("/user", async (req, res) => {
  const emailId = req.body.emailId;
  try {
    const user = await User.findOne({ emailId: emailId });
    res.send(user);
  } catch (error) {
    res.status(400).send("Something went wrong...");
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("User deleted successfully");
  } catch (error) {
    res.status(400).send("Something went wrong...");
  }
});

app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;
  try {
    const ALLOWED_UPDATE = ["lastName", "age", "password", "photoUrl", "gender", "userId"];
    const isAllowUpdate = Object.keys(data).every((k) => ALLOWED_UPDATE.includes(k));
    if (!isAllowUpdate) throw new Error("Invalid Data");
    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true,
    });
    res.send("user updated successfully");
  } catch (error) {
    res.status(400).send("Update Error : " + error.message);
  }
});

connectDB()
  .then(() => {
    app.listen(PORT, (req, res) => {
      console.log("Hello ! Server is up and running on PORT :", PORT);
    });
  })
  .catch((err) => {
    console.log("Database cannot  established", err);
  });
