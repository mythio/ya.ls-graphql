/// <reference path="./types/graphql.d.ts" />
import express from 'express';
import { ApolloServer } from 'apollo-server-express';

import './database';
import { apolloConfig } from './core/config';
import * as typeDefs from './graphql/type-defs.graphql';
import { AuthDirective } from './graphql/AuthDirective';
import { queryResolvers, mutationResolver } from './graphql/resolvers';

const app = express();

const server = new ApolloServer({
	typeDefs,
	resolvers: { Query: queryResolvers, Mutation: mutationResolver },
	introspection: apolloConfig.introspection,
	playground: apolloConfig.playground,
	schemaDirectives: { auth: AuthDirective },
	context: ({ req }) => { return { authorization: req.headers.authorization }; }
});

server.applyMiddleware({ app });

export default app;