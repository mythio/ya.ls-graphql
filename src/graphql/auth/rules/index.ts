const admin = require("./admin");
// const user = require("./user");
// const reviewer = require("./reviewer");

interface Rules {
  admin: Function;
};

export const rules: Rules = {
  admin: admin,
  // user,
  // reviewer
};
