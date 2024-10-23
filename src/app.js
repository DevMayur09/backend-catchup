const express = require("express");
const connectDB = require("./config/database.js");
const User = require("./models/user.js");
const app = express();
const { adminAuth, userAuth } = require("./middlewares/auth");
const user = require("./models/user.js");

const PORT = 3000;
app.use(express.json());

// POST /signup for user creation
app.post("/signup", async (req, res) => {
  const user = new User(req.body);

  await user.save();
  res.send("User Added Successfully !!!");
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
    const user = await User.findByIdAndUpdate({ _id: userId }, data, { returnDocument: "after" });
    res.send("user updated successfully");
  } catch (error) {
    res.status(400).send("Something went wrong...");
  }
});

connectDB()
  .then(() => {
    console.log("Database Connections established...");
    app.listen(PORT, (req, res) => {
      console.log("Hello ! Server is up and running on PORT :", PORT);
    });
  })
  .catch((err) => {
    console.log("Database cannot  established", err);
  });
