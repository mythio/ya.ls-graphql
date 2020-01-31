const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const jwt = require("jsonwebtoken");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email_address: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  joining_date: {
    type: Date,
    default: Date.now()
  },
  short_url: [
    {
      type: String,
      ref: "ShortUrl"
    }
  ]
});

userSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { userId: this._id, emailAddress: this.email_address },
    "supersecret"
  );
};

// function validateUser(user) {
//   const joi_schema = {
//     email_address: Joi.string().email(),
//     password: Joi.string().min(8)
//   };

//   return Joi.validate(user, joi_schema);
// }

userSchema.methods.validateUser = function() {
  const joi_schema = {
    email_address: Joi.string().email(),
    password: Joi.string().min(8)
  };

  return Joi.validate(this, joi_schema);
};

exports.User = mongoose.model("User", userSchema);
// exports.validateUser = validateUser;
