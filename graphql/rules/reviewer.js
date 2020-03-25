const userRule = require("./user");

const reviewRule = async requestData => {
  await userRule(requestData);
  return true;
};

module.exports = reviewRule;
