require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const { ApolloServer } = require("apollo-server-express");
const jwt = require("jsonwebtoken");

const app = express();

const port = process.env.PORT;
const path = process.env._PATH;

const server = new ApolloServer({
  typeDefs: require("./utils/gqlLoader")(),
  resolvers: require("./graphql/resolvers"),
  schemaDirectives: {
    objectAuth: require("./graphql/directives/Auth")
  },
  context: require("./graphql/context")
});

server.applyMiddleware({ app, path });

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    app.listen({ port }, () => {
      console.log(
        `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
      );
    });
  })
  .catch(err => {
    console.log("Mongoose Error");
    console.log(err);
  });
