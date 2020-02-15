const jwt = require("jsonwebtoken");

const { User } = require("../../models/user");
const adminRule = require("./admin");

const userRule = async requestData => {
  const isAdmin = await adminRule(requestData);
  if (isAdmin) {
    return true;
  }

  const { headers } = requestData;

  if (!headers || !headers.authorization) {
    return false;
  }

  try {
    const { authorization } = headers;
    const token = jwt.verify(authorization, process.env.USER_SECRET);

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
