const jwt = require("jsonwebtoken");

module.exports = ({ req }) => {
  const authHeader = req.headers.authorization;
  const user = jwt.decode(authHeader, "secret");
  return { user };
};
