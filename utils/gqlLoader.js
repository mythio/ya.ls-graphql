const fs = require("fs");
const path = require("path");

module.exports = () => {
  const filePath = path.join(__dirname, "../graphql/schema.graphql");

  return fs.readFileSync(filePath, "utf-8");
};
