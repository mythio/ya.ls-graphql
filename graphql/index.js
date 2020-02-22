const typeDefs = require("../utils/gqlLoader")();
const resolvers = require("./resolvers");
const schemaDirectives = { auth: require("./directives/AuthDirective") };
const context = require("./context");

module.exports = {
  typeDefs,
  resolvers,
  schemaDirectives,
  context
};
