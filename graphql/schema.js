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
    shareWith: [ID!]
    createdBy: User
  }

  type ShortUrl {
    shortId: String!
    originalUrl: String!
    shareWith: [ID!]
  }

  type AuthData {
    token: String!
    userId: ID!
  }

  type Query {
    login(emailAddress: String!, password: String!): AuthData!
    expandUrl(shortId: String!): ShortUrlDetail!
  }

  type Mutation {
    createUser(name: String!, emailAddress: String!, password: String!): User!
    shortenUrl(originalUrl: String!, shareWith: [ID!]): ShortUrl!
  }
`;
