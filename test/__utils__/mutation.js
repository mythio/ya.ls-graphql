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

// const QUERY_LOGIN = gql`
//   query LoginQuery($emailAddress: String!, $password: String!) {
//     login(emailAddress: $emailAddress, password: $password) {
//       token
//       userId
//     }
//   }
// `;

// const QUERY_EXPAND_URL = gql`
//   query ExpandUrl($shortId: String!) {
//     expandUrl(shortId: $shortId) {
//       shortId
//       originalUrl
//     }
//   }
// `;

module.exports = { MUTATION_CREATE_USER };
