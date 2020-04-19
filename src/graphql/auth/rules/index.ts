import { adminRule } from "./admin";
// const user = require("./user");
// const reviewer = require("./reviewer");

interface Rules {
  admin: Function;
};

export const rules: Rules = {
  admin: adminRule,
  // user,
  // reviewer
};
