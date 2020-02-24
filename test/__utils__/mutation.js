const gql = require("graphql-tag");

const MUTATION_CREATE_USER = gql`
  mutation($name: String!, $emailAddress: String!, $password: String!) {
    createUser(name: $name, emailAddress: $emailAddress, password: $password) {
      userId
      name
      emailAddress
    }
  }
`;

const MUTATION_EDIT_PRIVILEGE = gql`
  mutation($userId: ID!, $isAdmin: Boolean!) {
    editPrivilage(userId: $userId, isAdmin: $isAdmin) {
      userId
      name
      emailAddress
      isAdmin
    }
  }
`;

module.exports = { MUTATION_CREATE_USER, MUTATION_EDIT_PRIVILEGE };
