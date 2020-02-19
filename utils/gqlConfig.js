const config = {
  typeDefs: require("./gqlLoader")(),
  resolvers: require("../graphql/resolvers"),
  schemaDirectives: {
    auth: require("../graphql/directives/AuthDirective")
  },
  context: require("../graphql/context")
};

module.exports = config;
