const { ApolloServer } = require("apollo-server-express");

const graphql = require("../../graphql");

const serverInit = (context = {}) => {
  return new ApolloServer({
    ...graphql,
    context
  });
};

module.exports = serverInit;
