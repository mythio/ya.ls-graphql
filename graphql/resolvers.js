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
      let { user } = ctx;
      user = await user.populate({ path: "shortIds" }).execPopulate();

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
      let shortUrl = await ShortUrl.findById(shortId);

      if (!shortUrl) {
        throw new Error("invalid shortId");
      }

      if (shortUrl.shareWith.length) {
        const { user } = ctx;
        const isShared = shortUrl.shareWith.find(function(uId) {
          return uId == user._id;
        });

        if (!isShared) {
          throw new Error("not authorized");
        }
      }

      shortUrl = await shortUrl
        .populate({ path: "createdBy", select: "_id name emailAddress" })
        .execPopulate();
      shortUrl = await shortUrl
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
        throw new Error("User already exists");
      }
      password = await bcrypt.hash(password, 10);
      let user = new User({
        name: name,
        emailAddress: emailAddress,
        password: password
      });
      user = await user.save();

      return pick.createUserResult(user._doc);
    },

    async shortenUrl(root, args, ctx) {
      const { error } = joiSchema.shortenUrlSchema.validate(args);
      if (error) {
        throw new Error(error);
      }
      let { originalUrl } = args;
      let { user } = ctx;

      if (user) {
        user = await user.populate("shortIds").execPopulate();

        const existingShortUrl = user.shortIds.find(
          sUrl => sUrl.originalUrl === originalUrl
        );

        let shareWith = [];
        let shortUrl = {};
        const argsShareWith = args.shareWith ? [...args.shareWith] : [];

        if (existingShortUrl) {
          shortUrl = await ShortUrl.findById(existingShortUrl._id);
          const sharedWith = [...shortUrl.shareWith, ...argsShareWith];

          shareWith = sharedWith.filter(function(item, index) {
            return sharedWith.indexOf(item) == index;
          });

          shortUrl.shareWith = shareWith;
          shortUrl = await shortUrl.save();
        } else {
          shareWith = [...argsShareWith, String(user._id)];
          shortUrl = new ShortUrl({
            _id: shortid.generate(),
            originalUrl: originalUrl,
            createdBy: String(user._id),
            shareWith: shareWith
          });

          shortUrl = await shortUrl.save();
          user.shortIds.push(shortUrl);
          user = await user.save();
        }

        return pick.shortenUrlResult(shortUrl);
      } else {
        let shortUrls = await ShortUrl.find({ originalUrl });
        let shortUrl = shortUrls.find(sUrl => sUrl.createdBy === undefined);

        if (!shortUrl) {
          shortUrl = new ShortUrl({
            _id: shortid.generate(),
            originalUrl: originalUrl
          });

          shortUrl = await shortUrl.save();
        }

        return pick.shortenUrlResult(shortUrl._doc);
      }
    },

    async editPrivilege(root, args, ctx) {
      const { userId, isAdmin } = args;

      let user = await User.findByIdAndUpdate(userId, {
        $set: {
          isAdmin
        }
      });

      user = await User.findById(userId);

      if (!user) {
        throw new Error("user not found");
      }

      return pick.editPrivilageResult(user._doc);
    },

    async deleteUser(root, args, ctx) {
      let { user } = ctx;
      let { userId } = args;

      if (!user || (!user.isAdmin && user._id != userId)) {
        throw new Error(`user not found`);
      } else {
        const deleteResp = await User.deleteOne({ _id: userId });
        if (!deleteResp.ok || deleteResp.deletedCount !== 1) {
          throw new Error("cannot delete the user");
        }
      }

      return pick.createUserResult(user);
    }
  }
};

module.exports = resolvers;
