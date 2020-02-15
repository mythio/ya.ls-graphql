const jwt = require("jsonwebtoken");

const { User } = require("../../models/user");

const adminRule = async requestData => {
  const { headers } = requestData;
  if (!headers || !headers.authorization) {
    return false;
  }

  try {
    const { authorization } = headers;
    const token = jwt.verify(authorization, process.env.ADMIN_SECRET);
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
