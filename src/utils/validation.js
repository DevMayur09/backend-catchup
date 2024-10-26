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

const validatePasswordResetData = (req) => {
  const { newPassword, confirmPassword } = req.body;

  if (!newPassword) {
    throwError("new Password is required");
  }

  if (!validator.isStrongPassword(newPassword)) {
    throwError("Please enter strong password");
  }

  if (newPassword !== confirmPassword)
    throwError("new password and confirm password does not match");
};

const throwError = (errMsg) => {
  throw new Error(errMsg);
};

module.exports = {
  validateSignupData,
  validateEditProfileData,
  validatePasswordResetData,
  throwError,
};
