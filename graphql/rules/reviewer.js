const userRule = require("./user");
const User = require("../../models/user");

const reviewRule = async requestData => {
  const isUser = await userRule(requestData);

  if (!isUser) {
    const user = await User.findById(process.env.ANONYMOUS_ID);
    requestData.user = user;
  }
  return true;
};

module.exports = reviewRule;
