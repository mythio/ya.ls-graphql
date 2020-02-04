const { gql } = require("apollo-server-express");

module.exports = gql`
  type User {
    _id: ID!
    name: String!
    emailAddress: String!
    shortIds: [ShortUrl!]
  }

  type ShortUrlDetail {
    shortId: String!
    originalUrl: String!
    createdBy: User
  }

  type ShortUrl {
    shortId: String!
    originalUrl: String!
  }

  type AuthData {
    token: String!
    userId: ID!
  }

  type Query {
    login(emailAddress: String!, password: String!): AuthData!
    expandUrl(shortId: String!): ShortUrl!
  }

  type Mutation {
    createUser(name: String!, emailAddress: String!, password: String!): User!
    shortenUrl(originalUrl: String!, shareWith: [ID!]): ShortUrl!
  }
`;
