const adminAuth = (req, res, next) => {
  const token = "XYZ";
  const isAdminAuthorized = token === "XYZ";
  if (isAdminAuthorized) res.send("Authorized admin");
  else res.status(401).send("Unauthorized admin");
};

const userAuth = (req, res, next) => {
  const token = "XYZW";
  const isUserAuthorized = token === "XYZ";
  if (isUserAuthorized) next();
  else res.status(401).send("Unauthorized user !");
};

module.exports = {
  adminAuth,
  userAuth,
};
