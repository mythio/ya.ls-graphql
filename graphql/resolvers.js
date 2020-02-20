const bcrypt = require("bcrypt");
const shortid = require("shortid");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const ShortUrl = require("../models/shortUrl");
const pick = require("../utils/pick");
const joiSchema = require("../utils/validation/schema");

const resolvers = {
  Query: {
    async me(root, args, ctx) {
      const { user } = ctx;
      await user.populate({ path: "shortIds" }).execPopulate();

      return pick.meResult(ctx.user._doc);
    },

    async login(root, args, ctx) {
      const { error } = joiSchema.userSignInSchema.validate(args);
      if (error) {
        throw new Error(error.message);
      }

      let { emailAddress, password } = args;
      const user = await User.findOne(
        { emailAddress },
        { _id: 1, password: 1 }
      );
      if (!user) {
        throw new Error("user not found");
      }

      const isEqual = await bcrypt.compare(password, user.password);
      if (!isEqual) {
        throw new Error("incorrect password");
      }

      const token = jwt.sign({ userId: user._id }, process.env.USER_SECRET);

      return pick.loginResult({ user, token });
    },

    async expandUrl(root, args, ctx) {
      let { shortId } = args;
      const shortUrl = await ShortUrl.findById(shortId);

      if (!shortUrl) {
        throw new Error("invalid shortId");
      }

      if (shortUrl.shareWith.length > 1) {
        const { user } = ctx;
        const isShared = shortUrl.shareWith.find(function(uId) {
          return uId == user._id;
        });

        if (!isShared) {
          throw new Error("not authorized");
        }
      }

      await shortUrl
        .populate({ path: "createdBy", select: "_id name emailAddress" })
        .execPopulate();
      await shortUrl
        .populate({ path: "shareWith", select: "_id name emailAddress" })
        .execPopulate();

      return pick.expandUrlResult(shortUrl);
    }
  },

  Mutation: {
    async createUser(root, args, ctx) {
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

      return pick.createUserResult(user._doc);
    },

    async shortenUrl(root, args, ctx) {
      const { error } = joiSchema.shortenUrlSchema.validate(args);
      if (error) {
        throw new Error(error);
      }

      let { originalUrl } = args;
      const shortId = shortid.generate();
      const { user } = ctx;

      await user.populate("shortIds").execPopulate();

      const existingShortUrl = user.shortIds.find(
        sUrl => sUrl.originalUrl === originalUrl
      );

      if (existingShortUrl) {
        const shortUrl = await ShortUrl.findById(existingShortUrl._id);
        let shareWith = [];
        if (user.password === "password") {
          shareWith = [String(user._id)];
        } else {
          const argsShareWith = args.shareWith ? [...args.shareWith] : [];
          const shortUrl = await ShortUrl.findById(existingShortUrl._id);
          const sharedWith = [
            ...shortUrl.shareWith,
            ...argsShareWith,
            String(user._id)
          ];

          sharedWith = sharedWith.filter(function(item, index) {
            return sharedWith.indexOf(item) == index;
          });
        }

        shortUrl.shareWith = shareWith;

        await shortUrl.save();

        return pick.shortenUrlResult(shortUrl);
      }

      let shareWith = [];

      const argsShareWith = args.shareWith ? [...args.shareWith] : [];

      shareWith = [...argsShareWith, String(user._id)];

      const shortUrl = new ShortUrl({
        _id: shortId,
        originalUrl: originalUrl,
        createdBy: String(user._id),
        shareWith: shareWith
      });

      await shortUrl.save();
      user.shortIds.push(shortUrl);
      await user.save();

      return pick.shortenUrlResult(shortUrl);
    }
  }
};

module.exports = resolvers;
