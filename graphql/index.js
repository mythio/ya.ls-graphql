const typeDefs = require("../utils/gqlLoader")();
const resolvers = require("./resolvers");
const schemaDirectives = { auth: require("./AuthDirective") };
const context = require("./context");

module.exports = {
  typeDefs,
  resolvers,
  schemaDirectives,
  context
};
