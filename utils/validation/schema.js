const Joi = require("@hapi/joi");

module.exports.userSignUpSchema = Joi.object({
  name: Joi.string()
    .min(4)
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
    .regex(
      /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/
    )
    .required()
    .error(errors => {
      return new Error('"originalUrl" is not a valid url');
    }),
  shareWith: Joi.array()
});
