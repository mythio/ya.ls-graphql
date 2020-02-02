const Joi = require("@hapi/joi");

module.exports.userSignUpSchema = Joi.object({
  name: Joi.string().min(3),
  emailAddress: Joi.string().email(),
  password: Joi.string().min(8)
});

module.exports.userSignInSchema = Joi.object({
  emailAddress: Joi.string().email(),
  password: Joi.string().min(8)
});

module.exports.shortenUrl = Joi.object({
  originalUrl: Joi.string().uri(),
  shareWith: Joi.array()
});
