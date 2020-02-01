const bcrypt = require("bcrypt");
const validator = require("validator");

const { User } = require("../models/user");

module.exports = {
  createUser: async function({ userInput }) {
    const errors = [];
    if (!validator.isEmail(userInput.email)) {
      errors.push({ message: "Invalid Email Id" });
    }
    if (
      validator.isEmpty(userInput.password) ||
      !validator.isLength(userInput.password, { min: 5 })
    ) {
      errors.push({ message: "Password is too short" });
    }
    if (errors.length > 0) {
      const error = new Error("Invalid input");
      error.data = errors;
      /**
       * Custom http error code 422
       */
      error.code = 422;
      throw error;
    }
    const exisitingUser = await User.findOne({
      email_address: userInput.email
    });
    if (exisitingUser) {
      const error = new Error("User already exists");
      /**
       * 409 Conflict
       */
      error.code = 409;
      throw error;
    }
    const hashedPw = await bcrypt.hash(userInput.password, 12);
    const user = new User({
      name: userInput.name,
      email_address: userInput.email,
      password: hashedPw,
      short_urls: []
    });
    const createdUser = await user.save();
    return { ...createdUser._doc };
  }
};
