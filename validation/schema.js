const Joi = require("@hapi/joi");

module.exports.userSignUpSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .required(),
  emailAddress: Joi.string()
    .email()
    .required(),
  password: Joi.string()
    .min(8)
    .required()
});

module.exports.userSignInSchema = Joi.object({
  emailAddress: Joi.string()
    .email()
    .required(),
  password: Joi.string()
    .min(8)
    .required()
});

module.exports.shortenUrlSchema = Joi.object({
  originalUrl: Joi.string()
    .uri()
    .required(),
  shareWith: Joi.array()
});

module.exports.expandUrlSchema = Joi.object({
  shortId: Joi.string().required()
});
