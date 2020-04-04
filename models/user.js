const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  emailAddress: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  joiningDate: {
    type: Date,
    default: Date.now()
  },
  shortIds: [
    {
      type: String,
      ref: "ShortUrl"
    }
  ],
  isAdmin: {
    type: Boolean,
    default: false
  },
  isVerified: {
    type: Boolean,
    required: true,
    default: false
  }
});

module.exports = mongoose.model("User", userSchema);
