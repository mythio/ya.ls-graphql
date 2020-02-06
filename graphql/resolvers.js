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
        throw new Error("User not found");
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
    },
    async expandUrl(root, args, context) {
      const { error } = joiSchema.expandUrlSchema.validate(args);
      if (error) {
        throw new ValidationError(error.message);
      }
      let { shortId } = args;
      const shortUrl = await ShortUrl.findOne({ _id: shortId }).populate(
        "createdBy"
      );
      await shortUrl.populate("createdBy.shortIds").execPopulate();

      return {
        ...shortUrl._doc,
        shortId: shortId,
        createdBy: {
          ...shortUrl.createdBy._doc,
          shortIds: shortUrl._doc.createdBy.shortIds.map(it => {
            return { ...it._doc, shortId: it._id };
          })
        }
      };
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
        name: name,
        emailAddress: emailAddress,
        password: password
      });
      await user.save();

      return { ...user._doc };
    },
    async shortenUrl(root, args, context) {
      const { error } = joiSchema.shortenUrlSchema.validate(args);
      if (error) {
        throw new Error(error);
      }
      let { originalUrl } = args;
      const shortId = shortid.generate();

      if (context.user) {
        const { _id: userId } = context.user;
        const user = await User.findOne({ _id: userId })
          .populate("shortIds", "originalUrl")
          .exec();

        const existingShortUrl = user.shortIds.find(
          sUrl => sUrl.originalUrl === originalUrl
        );

        if (existingShortUrl) {
          const shortUrl = await ShortUrl.findById(existingShortUrl._id);
          const sharedWith = [...shortUrl.shareWith, ...args.shareWith];

          shortUrl.shareWith = sharedWith.filter(function(item, index) {
            return sharedWith.indexOf(item) === index;
          });
          await shortUrl.save();

          return {
            ...shortUrl._doc,
            shortId: shortUrl._id
          };
        }

        const shortUrl = new ShortUrl({
          _id: shortId,
          originalUrl: originalUrl,
          createdBy: userId,
          shareWith: args.shareWith
        });
        await shortUrl.save();
        user.shortIds.push(shortUrl);
        await user.save();

        return {
          ...shortUrl._doc,
          shortId: shortUrl._id
        };
      } else {
        const existingShortUrls = await ShortUrl.findOne({
          originalUrl,
          createdBy: null
        });

        if (existingShortUrls) {
          const shortUrl = existingShortUrls;

          return {
            ...shortUrl._doc,
            shortId: shortUrl._id
          };
        }

        const shortUrl = new ShortUrl({
          _id: shortId,
          originalUrl: originalUrl
        });
        await shortUrl.save();

        return {
          ...shortUrl._doc,
          shortId: shortUrl._id
        };
      }
    }
  }
};
