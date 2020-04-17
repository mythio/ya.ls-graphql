/// <reference path="./types/graphql.d.ts" />
import { ApolloServer } from 'apollo-server';

import { config } from './config';
import { resolvers } from './resolvers';
import * as typeDefs from './type-defs.graphql';

export default new ApolloServer({
  typeDefs,
  resolvers,
  introspection: config.apollo.introspection,
  playground: config.apollo.playground,
});