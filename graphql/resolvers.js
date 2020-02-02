const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const shortid = require("shortid");

const { User } = require("../models/user");
const { ShortUrl } = require("../models/shortUrl");
const joiSchema = require("../validation/schema");

module.exports = {
  Query: {
    async login(root, args, context) {
      const { error } = joiSchema.userSignInSchema.validate(args);
      if (error) {
        throw new Error(error.message);
      }
      let { emailAddress, password } = args;
      const user = await User.findOne({ emailAddress });
      if (!user) {
        throw new Error("User not found!");
      }
      const isEqual = await bcrypt.compare(password, user.password);
      if (!isEqual) {
        throw new Error("Incorrect password");
      }
      const token = jwt.sign(
        {
          userId: user._id,
          name: user.name,
          emailAddress: user.emailAddress
        },
        "secret"
      );
      return { userId: user._id, token };
    }
  },
  Mutation: {
    async createUser(root, args, context) {
      const { error } = joiSchema.userSignUpSchema.validate(args);
      if (error) {
        throw new Error(error.message);
      }
      let { name, emailAddress, password } = args;
      const existingUser = await User.findOne({ emailAddress });
      if (existingUser) {
        throw new Error("User already exists!");
      }
      password = await bcrypt.hash(password, 10);
      const user = new User({
        name,
        emailAddress,
        password
      });
      await user.save();
      return { ...user._doc };
    },
    async shortenUrl(root, args, context) {
      const { error } = joiSchema.shortenUrl.validate(args);
      if (error) {
        throw new Error(error);
      }
      let { originalUrl } = args;
      const short = "localhost:4000/" + shortid.generate();
      if (context.user) {
        const { userId } = context.user;
        const user = await User.findOne({ _id: userId });
        const shortUrl = new ShortUrl({
          shortUrl: short,
          originalUrl: originalUrl,
          createdBy: user,
          shareWith: args.shareWith
        });
        await shortUrl.save();
        user.shortUrls.push(shortUrl);
        await user.save();
        return { ...shortUrl._doc };
      } else {
        const shortUrl = new ShortUrl({
          shortUrl: short,
          originalUrl: originalUrl
        });
        await shortUrl.save();
        return { ...shortUrl._doc };
      }
    }
  }
};
