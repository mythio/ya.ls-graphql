const jwt = require("jsonwebtoken");

module.exports = ({ req }) => {
  const auth = req.headers.authorization;
  const token = jwt.verify(auth, "secret");
  return { token };
};
