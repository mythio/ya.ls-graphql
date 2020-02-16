const jwt = require("jsonwebtoken");

// module.exports = ({ req }) => {
//   const auth = req.headers.authorization;
//   if (!auth) {
//     return;
//   }
//   const token = jwt.verify(auth, "secret");
//   return { token };
// };

module.exports = ({ req }) => ({ authorization: req.headers.authorization });
