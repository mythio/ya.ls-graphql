const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const shortUrlSchema = new Schema({
  _id: {
    type: String,
    required: true
  },
  originalUrl: {
    type: String,
    required: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  shareWith: [
    {
      type: String,
      ref: "User"
    }
  ]
});

module.exports = mongoose.model("ShortUrl", shortUrlSchema);
