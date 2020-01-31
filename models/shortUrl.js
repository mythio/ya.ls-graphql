const mongoose = require("mongoose");
const validUrl = require("valid-url");
const Joi = require("@hapi/joi");

const Schema = mongoose.Schema;

const shortUrlSchema = new Schema({
  original_url: {
    type: String,
    required: true
  },
  creator_user_id: {
    type: String
  },
  shareable: {
    type: Boolean,
    required: true
  },
  share_with: [
    {
      type: String,
      ref: "User"
    }
  ],
  _id: String
});

// function validateUrl(url) {
//   const joi_schema = {
//     original_url: Joi.string().uri(),
//     creator_user_id: Joi.string(),
//     shareable: Joi.boolean(),
//     share_with: Joi.array()
//   };
//   return Joi.validate(url, joi_schema);
//   // var expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
//   // var regex = new RegExp(expression);
//   // return validUrl.isUri(url) && url.match(regex);
// }

shortUrlSchema.methods.validateUrl = function() {
  const joi_schema = {
    original_url: Joi.string().uri(),
    creator_user_id: Joi.string(),
    shareable: Joi.boolean(),
    share_with: Joi.array()
  };
  return Joi.validate(this, joi_schema);
};

exports.ShortUrl = mongoose.model("ShortUrl", shortUrlSchema);
exports.validateUrl = validateUrl;
