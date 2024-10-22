const express = require("express");
const app = express();

const { adminAuth, userAuth } = require("./middlewares/auth");

const PORT = 3000;

app.use("/admin", adminAuth);
app.use("/user", userAuth);

app.get("/user", (req, res) => {
  res.send({ firstName: "Mayur", lastName: "Thool" });
});

app.post("/user", (req, res) => {
  res.send("POST user requests response");
});

app.put("/user", (req, res) => {
  res.send("PUT user requests response");
});

app.delete("/user", (req, res) => {
  res.send("DELETE user requests response");
});

app.use("/", (err, req, res, next) => {
  res.send("Something went wrong, contact support");
});

app.listen(PORT, (req, res) => {
  console.log("Hello ! Server is up and running on PORT :", PORT);
});
