const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const shortUrlSchema = new Schema({
  shortUrl: {
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
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  ]
});

exports.ShortUrl = mongoose.model("ShortUrl", shortUrlSchema);
