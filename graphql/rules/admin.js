const jwt = require("jsonwebtoken");

const { User } = require("../../models/user");

const adminRule = async requestData => {
  const { token } = requestData;
  if (!token) {
    return false;
  }

  try {
    const user = await User.findById(token.userId);

    if (!user || !user.isAdmin) {
      return false;
    }
  } catch (err) {
    return false;
  }

  return true;
};

module.exports = adminRule;
