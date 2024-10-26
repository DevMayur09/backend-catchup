const { throwError } = require("../utils/validation");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) throwError("Invalid Token");

    const decodedObj = await jwt.verify(token, "CatchUpSecretJwtKey");

    const { _id } = decodedObj;

    const user = await User.findById(_id);

    if (!user) throwError("User does not exist");

    req.user = user;
    next();
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
};

module.exports = {
  userAuth,
};
