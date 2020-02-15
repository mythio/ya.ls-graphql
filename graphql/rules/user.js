const jwt = require("jsonwebtoken");

const { User } = require("../../models/user");
const adminRule = require("./admin");

const userRule = async requestData => {
  const isAdmin = await adminRule(requestData);
  if (isAdmin) {
    return true;
  }

  const { token } = requestData;

  if (!token) {
    return false;
  }

  try {
    const user = await User.findById(token.userId);

    if (!user) {
      return false;
    }
  } catch (err) {
    return false;
  }

  return true;
};

module.exports = userRule;
