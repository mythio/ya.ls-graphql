const config = {
  typeDefs: require("./gqlLoader")(),
  resolvers: require("../graphql/resolvers"),
  schemaDirectives: {
    auth: require("../graphql/directives/AuthDirective")
  },
  context: require("../graphql/context"),
  introspection: true,
  playground: true
};

module.exports = config;
