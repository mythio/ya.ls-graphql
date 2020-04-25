import "./database";

import { ApolloServer } from "apollo-server-express";
import cookieParser from "cookie-parser";
import express from "express";

import { apolloConfig } from "./core/config";
import { AuthDirective } from "./graphql/AuthDirective";
import { mutationResolver } from "./graphql/resolvers/mutationResolvers";
import { queryResolvers } from "./graphql/resolvers/queryResolvers";
import * as typeDefs from "./graphql/type-defs.graphql";

const app = express();
app.use(cookieParser());

const server = new ApolloServer({
	typeDefs,
	resolvers: { Query: queryResolvers, Mutation: mutationResolver },
	introspection: apolloConfig.introspection,
	playground: apolloConfig.playground,
	schemaDirectives: { auth: AuthDirective },
	context: ({ req, res }) => ({ req, res })
});

server.applyMiddleware({ app });

export default app;
