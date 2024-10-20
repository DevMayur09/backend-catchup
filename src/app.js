const express = require("express");
const app = express();

const PORT = 3000;

app.use("/", (req, res) => {
  res.send("Server is saying Hello !....");
});

app.use("test", (req, res) => {
  res.send("Server running with nodemon !!");
});

app.listen(PORT, (req, res) => {
  console.log("Hello ! Server is up and running on PORT :", PORT);
});
