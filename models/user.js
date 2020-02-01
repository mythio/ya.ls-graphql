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
  short_urls: [
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

exports.User = mongoose.model("User", userSchema);
