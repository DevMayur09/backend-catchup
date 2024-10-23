const express = require("express");
const connectDB = require("./config/database.js");
const User = require("./models/user.js");
const app = express();
const { adminAuth, userAuth } = require("./middlewares/auth");

const PORT = 3000;
app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new User(req.body);

  await user.save();
  res.send("User Added Successfully !!!");
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
