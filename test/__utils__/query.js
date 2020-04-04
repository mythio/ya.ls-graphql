const gql = require("graphql-tag");

const QUERY_ME = gql`
  query {
    me {
      userId
      name
      emailAddress
      shortIds {
        shortId
        originalUrl
      }
      isVerified
      isAdmin
    }
  }
`;

const QUERY_LOGIN = gql`
  query LoginQuery($emailAddress: String!, $password: String!) {
    login(emailAddress: $emailAddress, password: $password) {
      token
      userId
    }
  }
`;

const QUERY_EXPAND_URL = gql`
  query ExpandUrl($shortId: String!) {
    expandUrl(shortId: $shortId) {
      shortId
      originalUrl
    }
  }
`;

module.exports = { QUERY_ME, QUERY_LOGIN, QUERY_EXPAND_URL };
