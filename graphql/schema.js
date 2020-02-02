const { gql } = require("apollo-server-express");

module.exports = gql`
  type User {
    _id: ID!
    name: String!
    emailAddress: String!
    shortUrls: [String]
  }

  type AuthData {
    token: String!
    userId: ID!
  }

  type ShortUrl {
    _id: ID!
    originalUrl: String!
    shortUrl: String!
    createdBy: User
  }

  type Query {
    login(emailAddress: String!, password: String!): AuthData!
  }

  type Mutation {
    createUser(name: String!, emailAddress: String!, password: String!): User!
    shortenUrl(originalUrl: String!, shareWith: [ID!]): ShortUrl!
  }
`;
