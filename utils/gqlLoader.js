const fs = require("fs");
const path = require("path");

module.exports = () => {
  const filePath = path.join(__dirname, "../graphql/schema.graphql");
  console.log(filePath);
  return fs.readFileSync(filePath, "utf-8");
};
