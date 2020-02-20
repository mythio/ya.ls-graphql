const { ApolloServer } = require("apollo-server-express");

const typeDefs = require("../../utils/gqlLoader")();
const resolvers = require("../../graphql/resolvers");
const schemaDirectives = require("../../graphql/schemaDirectives");

const serverInit = (context = {}) => {
  return new ApolloServer({
    typeDefs,
    resolvers,
    schemaDirectives,
    context
  });
};

module.exports = serverInit;
