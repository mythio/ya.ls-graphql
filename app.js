const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");

const graphqlSchema = require("./graphql/schema");
const graphqlResolver = require("./graphql/resolvers");
const auth = require("./middleware/auth");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Allow-Control-Allow_Origin", "*");
  res.setHeader("Allow-Control-Allow-Methods", "OPTIONS, GET, POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(auth);

app.use(
  "/graphql",
  graphqlHttp({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true,
    customFormatErrorFn(err) {
      if (!err.originalError) {
        return err;
      }
      const data = err.originalError.data;
      const message = err.message || "An error occurred";
      const code = err.originalError.code || 500;
      return {
        message,
        data,
        code
      };
    }
  })
);

mongoose
  .connect(
    process.env.MONGOLAB_URI || "mongodb://localhost:27017/ya-ls-graphql",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  )
  .then(result => {
    console.log("OK");
    app.listen(process.env.PORT || 3000);
  })
  .catch(err => {
    console.log("Mongoose Error");
  });
