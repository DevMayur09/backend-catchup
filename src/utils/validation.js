const validator = require("validator");
const validateSignupData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throwError("Invalid Name");
  } else if (!emailId) {
    throwError("Please enter emailId");
  } else if (!password) {
    throwError("Please enter emailId");
  } else if (!validator.isEmail(emailId)) {
    throwError("Invalid email");
  } else if (!validator.isStrongPassword(password)) {
    throwError("Please enter strong password");
  }
};

const validateEditProfileData = (req) => {
  const allowedEditFileds = ["firstName", "lastName", "gender", "age", "hobbies", "photoUrl"];

  const isValidData = Object.keys(req.body).every((field) => allowedEditFileds.includes(field));

  return isValidData;
};

const throwError = (errMsg) => {
  throw new Error(errMsg);
};

module.exports = {
  validateSignupData,
  validateEditProfileData,
  throwError,
};
