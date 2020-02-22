const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("../../models/user");
const ShortUrl = require("../../models/shortUrl");

mongoose.Promise = global.Promise;

const cleanDB = async done => {
  await User.deleteMany({});
  await ShortUrl.deleteMany({});
  done();
};

const connectToDB = async () => {
  const connection = await mongoose.connect(
    "mongodb://localhost/yals-graphql-test",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  );
  return connection;
};

const disconnectDB = (done = () => {}) => {
  mongoose.disconnect(done);
};

const generateMongooseId = () => {
  return mongoose.Types.ObjectId();
};

const writeDefaults = async () => {
  const password = await bcrypt.hash("password", 10);
  let userIds = [
    "5e4dcdfcc76d441afd3d29d6",
    "5e4dcdfcc76d441afd3d29d7",
    "5e4dcdfcc76d441afd3d29d8",
    "5e4dcdfcc76d441afd3d29d9"
  ];
  let names = ["foobar", "user1", "user2", "user3"];
  let emails = [
    "foo@bar.com",
    "email@address1.com",
    "email@address2.com",
    "email@address3.com"
  ];
  let shortUrls = [["4AItBPXz", "td1sQf8B"], ["8q2T-dgm", "2BF2S1bc"], [], []];
  let originalUrls = [
    "https://google.com/1",
    "https://google.com/2",
    "https://google.com/3",
    "https://google.com/4"
  ];
  let shortUrlIds = ["4AItBPXz", "td1sQf8B", "8q2T-dgm", "2BF2S1bc"];
  let shareWith = [
    ["5e4dcdfcc76d441afd3d29d6"],
    ["5e4dcdfcc76d441afd3d29d6", "5e4dcdfcc76d441afd3d29d7"],
    ["5e4dcdfcc76d441afd3d29d7"],
    [
      "5e4dcdfcc76d441afd3d29d7",
      "5e4dcdfcc76d441afd3d29d6",
      "5e4dcdfcc76d441afd3d29d8"
    ]
  ];
  for (let i = 0; i < 4; ++i) {
    const user = new User({
      _id: userIds[i],
      name: names[i],
      emailAddress: emails[i],
      password: password,
      shortIds: shortUrls[i]
    });

    const shortUrl = new ShortUrl({
      _id: shortUrlIds[i],
      originalUrl: originalUrls[i],
      shareWith: shareWith[i]
    });

    await shortUrl.save();
    await user.save();
  }
};

module.exports = {
  cleanDB,
  connectToDB,
  disconnectDB,
  generateMongooseId,
  writeDefaults
};
