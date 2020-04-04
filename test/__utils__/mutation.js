const gql = require("graphql-tag");

const MUTATION_CREATE_USER = gql`
  mutation($name: String!, $emailAddress: String!, $password: String!) {
    createUser(name: $name, emailAddress: $emailAddress, password: $password) {
      userId
      name
      emailAddress
      isVerified
    }
  }
`;

const MUTATION_VERIFY_USER = gql`
  mutation($token: String!) {
    verifyUser(token: $token)
  }
`;

const MUTATION_EDIT_PRIVILEGE = gql`
  mutation($userId: ID!, $isAdmin: Boolean!) {
    editPrivilege(userId: $userId, isAdmin: $isAdmin) {
      userId
      name
      emailAddress
      isAdmin
    }
  }
`;

const MUTATITON_SHORTEN_URL = gql`
  mutation($originalUrl: String!) {
    shortenUrl(originalUrl: $originalUrl) {
      shortId
      originalUrl
      shareWith
    }
  }
`;

const MUTATION_DELETE_USER = gql`
  mutation($userId: ID!) {
    deleteUser(userId: $userId)
  }
`;

module.exports = {
  MUTATION_CREATE_USER,
  MUTATION_VERIFY_USER,
  MUTATION_EDIT_PRIVILEGE,
  MUTATITON_SHORTEN_URL,
  MUTATION_DELETE_USER
};
