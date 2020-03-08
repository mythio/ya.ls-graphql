const Joi = require("@hapi/joi");

module.exports.userSignUpSchema = Joi.object({
  name: Joi.string()
    .min(4)
    .required()
    .error(new Error('Field "name" must be a string of atleast 4 characters')),
  emailAddress: Joi.string()
    .email()
    .required()
    .error(new Error('Field "emailAddress" must be a valid email address')),
  password: Joi.string()
    .min(8)
    .required()
    .error(
      new Error('Field "password" must be a string of atleast 8 characters')
    )
});

module.exports.userSignInSchema = Joi.object({
  emailAddress: Joi.string()
    .email()
    .required()
    .error(new Error('Field "emailAddress" must be a valid email address')),
  password: Joi.string()
    .min(8)
    .required()
    .error(
      new Error('Field "password" must be a string of atleast 8 characters')
    )
});

module.exports.shortenUrlSchema = Joi.object({
  originalUrl: Joi.string()
    .regex(
      /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/
    )
    .uri()
    .required()
    .error(errors => {
      return new Error('Field "originalUrl" must be a valid url');
    }),
  shareWith: Joi.array()
});
