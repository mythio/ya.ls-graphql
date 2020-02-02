const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const Schema = mongoose.Schema;

const shortUrlSchema = new Schema({
  short_url: {
    type: String,
    required: true
  },
  original_url: {
    type: String,
    required: true
  },
  created_by: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  share_with: [
    {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  ]
});

shortUrlSchema.methods.validateUrl = function() {
  const joi_schema = {
    original_url: Joi.string().uri(),
    creator_user_id: Joi.string(),
    share_with: Joi.array()
  };
  return Joi.validate(this, joi_schema);
};

exports.ShortUrl = mongoose.model("ShortUrl", shortUrlSchema);
