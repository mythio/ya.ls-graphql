const jwt = require("jsonwebtoken");

const { User } = require("../../models/user");

const adminRule = async requestData => {
  const { authorization } = requestData;
  if (!authorization) {
    return false;
  }

  try {
    const token = jwt.verify(authorization, "secret");
    const user = await User.findById(token.userId);

    if (!user || !user.isAdmin) {
      return false;
    }

    requestData.user = user;
  } catch (err) {
    return false;
  }

  return true;
};

module.exports = adminRule;
