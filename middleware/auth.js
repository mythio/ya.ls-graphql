const jwt = require("jsonwebtoken");
const { User } = require("../models/user");

module.exports = async ({ req }) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = jwt.decode(authHeader, "secret");
    const user = await User.findById(token.userId);
    if (user) {
      return { token };
    }
    return { token: null };
  }
};
