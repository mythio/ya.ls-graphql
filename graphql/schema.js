const { gql } = require("apollo-server-express");

module.exports = gql`
  type User {
    _id: ID!
    name: String!
    email_address: String!
    password: String
    shortUrl: [String]
  }

  type AuthData {
    token: String!
    userId: ID!
  }

  type ShortUrl {
    _id: ID!
    original_url: String!
    short_url: String!
    created_by: User
  }

  type Query {
    login(email_address: String!, password: String!): AuthData!
  }

  type Mutation {
    createUser(name: String!, email_address: String!, password: String!): User!
    shortenUrl(original_url: String!, share_with: [ID!]): ShortUrl!
  }
`;
