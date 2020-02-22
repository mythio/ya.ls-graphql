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

module.exports = { MUTATION_CREATE_USER };
