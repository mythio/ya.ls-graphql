/// <reference path="./types/graphql.d.ts" />
import express from 'express';
import { ApolloServer } from 'apollo-server-express';

import config from './core/config';
import { resolvers } from './graphql/resolvers';
import * as typeDefs from './graphql/type-defs.graphql';

const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: config.apollo.introspection,
  playground: config.apollo.playground,
});

server.applyMiddleware({ app });

export default app;