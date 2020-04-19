/// <reference path="./types/graphql.d.ts" />
import express from 'express';
import { ApolloServer } from 'apollo-server-express';

import './database';
import { apolloConfig } from './core/config';
import { queryResolvers, mutationResolver } from './graphql/resolvers';
import * as typeDefs from './graphql/type-defs.graphql';
import { AuthDirective } from './graphql/AuthDirective';

const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers: { Query: queryResolvers, Mutation: mutationResolver },
  introspection: apolloConfig.introspection,
  playground: apolloConfig.playground,
  schemaDirectives: { auth: AuthDirective }
});

server.applyMiddleware({ app });

export default app;