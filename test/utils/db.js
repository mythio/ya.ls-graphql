const mongoose = require("mongoose");

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
  const user = new User({
    _id: process.env.ANONYMOUS_ID,
    name: "FooBar",
    emailAddress: "foo@bar.com",
    password: "password"
  });

  await user.save();
};

module.exports = {
  cleanDB,
  connectToDB,
  disconnectDB,
  generateMongooseId,
  writeDefaults
};
