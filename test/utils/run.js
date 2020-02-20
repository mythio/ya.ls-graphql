const { makeExecutableSchema } = require("graphql-tools");
const { graphql } = require("graphql");
const typeDefs = require("../../utils/gqlLoader")();
const resolvers = require("../../graphql/resolvers");
const schemaDirectives = {
  auth: require("../../graphql/directives/AuthDirective")
};
const context = require("../../graphql/context");

const runQuery = (query, variables = {}, ctx = {}) => {
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      console.log("testasrfasdasdas");
      // return { authorization: req.headers.authorization };
    },
    schemaDirectives
  });
  return graphql(schema, query, null, { ...context, ...ctx }, variables);
};

module.exports = { runQuery };
