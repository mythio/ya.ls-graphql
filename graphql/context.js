module.exports = ({ req }) => {
  return { authorization: req.headers.authorization };
};
