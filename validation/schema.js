const Joi = require("@hapi/joi");

module.exports.userSignUpSchema = Joi.object({
  name: Joi.string().min(3),
  email_address: Joi.string().email(),
  password: Joi.string().min(8)
});

module.exports.userSignInSchema = Joi.object({
  email_address: Joi.string().email(),
  password: Joi.string().min(8)
});

module.exports.shortenUrl = Joi.object({
  original_url: Joi.string().uri(),
  share_with: Joi.array()
});
