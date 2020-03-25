const jwt = require("jsonwebtoken");

const User = require("../../models/user");
const adminRule = require("./admin");

const userRule = async requestData => {
  const isAdmin = await adminRule(requestData);
  if (isAdmin) {
    return true;
  }

  const { authorization } = requestData;

  if (!authorization) {
    return false;
  }

  try {
    const token = jwt.verify(authorization, process.env.USER_SECRET);
    const user = await User.findById(token.userId);

    console.log(user);
    if (!user) {
      return false;
    }

    requestData.user = user;
  } catch (err) {
    return false;
  }

  return true;
};

module.exports = userRule;
