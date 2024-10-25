const validator = require("validator");
const validateSignupData = (req) => {
  console.log(req.body);
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

const throwError = (errMsg) => {
  throw new Error(errMsg);
};

module.exports = {
  validateSignupData,
  throwError,
};
