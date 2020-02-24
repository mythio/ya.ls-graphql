const graphql = require("../graphql");

const config = {
  ...graphql,
  introspection: true,
  playground: true
};

module.exports = config;
