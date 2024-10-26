const express = require("express");
const app = express();

const connectDB = require("./config/database.js");
const cookieParser = require("cookie-parser");

const authRouter = require("./routes/auth.js");
const profileRouter = require("./routes/profile.js");
const requestRouter = require("./routes/request.js");

app.use(express.json());
app.use(cookieParser());

app.use(authRouter);
app.use(profileRouter);
app.use(requestRouter);

const PORT = 3000;

connectDB()
  .then(() => {
    app.listen(PORT, (req, res) => {
      console.log("Hello ! Server is up and running on PORT :", PORT);
    });
  })
  .catch((err) => {
    console.log("Database cannot  established", err);
  });
