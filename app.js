require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const config = require("./utils/gqlConfig");
const { ApolloServer } = require("apollo-server-express");

const app = express();

const port = process.env.PORT;
const path = process.env._PATH;

const server = new ApolloServer(config);

server.applyMiddleware({ app, path });

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => {
    app.listen({ port }, () => {
      console.log(`🚀 Server ready ${port}`);
    });
  })
  .catch(err => {
    console.log("Mongoose Error");
    console.log(err);
  });

module.exports = server;
