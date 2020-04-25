import express from "express";
import { ApolloServer } from "apollo-server-express";
import cookieParser from "cookie-parser";

import "./database";
import { apolloConfig } from "./core/config";
import * as typeDefs from "./graphql/type-defs.graphql";
import { AuthDirective } from "./graphql/AuthDirective";
import { queryResolvers } from "./graphql/resolvers/queryResolvers";
import { mutationResolver } from "./graphql/resolvers/mutationResolvers";

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
