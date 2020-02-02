const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const mongoose = require("mongoose");

const typeDefs = require("./graphql/schema");
const resolvers = require("./graphql/resolvers");
const context = require("./middleware/auth");

const app = express();
const port = process.env.PORT || 4000;
const path = process.env._PATH || "/graphql";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context
});

server.applyMiddleware({ app, path });

mongoose
  .connect(
    process.env.MONGOLAB_URI || "mongodb://localhost:27017/ya-ls-graphql",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  )
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
