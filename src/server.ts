/// <reference path="./types/graphql.d.ts" />
import express from 'express';
import { ApolloServer } from 'apollo-server-express';

import config from './config';
import { resolvers } from './resolvers';
import * as typeDefs from './type-defs.graphql';

const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: config.apollo.introspection,
  playground: config.apollo.playground,
});

server.applyMiddleware({ app });

export default app;