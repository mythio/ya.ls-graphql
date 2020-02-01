const { buildSchema } = require("graphql");

module.exports = buildSchema(`
  type User {
    _id: String!
    name: String!
    email: String!
    password: String
    shortUrl: [String]
  }

  type AuthData {
    token: String!
    userId: ID!
  }

  input UserInputData {
    email: String!
    name: String!
    password: String!
  }

  type Query {
    login(email: String!, password: String!): AuthData!
  }

  type Mutation {
    createUser(userInput: UserInputData): User!
  }

  schema {
    query: Query
    mutation: Mutation
  }
`);
