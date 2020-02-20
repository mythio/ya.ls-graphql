require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createTestClient } = require("apollo-server-testing");

const db = require("./utils/db");
const User = require("../models/user");
const GQLquery = require("./utils/query");
const serverInit = require("./utils/server");
const ShortUrl = require("../models/shortUrl");

describe("Resolver", () => {
  beforeAll(db.connectToDB);
  afterAll(db.disconnectDB);
  afterEach(db.cleanDB);

  describe("query.me", () => {
    test("should have correct query", async () => {
      const user = new User({
        _id: "5e4dcdfcc76d441afd3d29d9",
        name: "user_name",
        emailAddress: "email@address.com",
        password: "password",
        shortIds: []
      });

      await user.save();
      const token = jwt.sign({ userId: user._id }, process.env.USER_SECRET);
      const server = serverInit({ authorization: token });

      const { query } = createTestClient(server);
      const res = await query({ query: GQLquery.QUERY_ME });
      expect(res.errors).toBeUndefined();
      expect(res.data).toMatchSnapshot();
    });

    test("should return `not authorized` for invalid userId", async () => {
      const user = new User({
        _id: "5e4dcdfcc76d441afd3d29d9",
        name: "user_name",
        emailAddress: "email@address.com",
        password: "password",
        shortIds: []
      });

      await user.save();
      const token = jwt.sign(
        { userId: "5e4dcdfcc76d441afd3d29d6" },
        process.env.USER_SECRET
      );
      const server = serverInit({ authorization: token });
      const { query } = createTestClient(server);
      const res = await query({ query: GQLquery.QUERY_ME });

      expect(res.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ message: "not authorized" })
        ])
      );
      expect(res.data).toBeNull();
    });

    test("should return `not authorized` for invalid token", async () => {
      const user = new User({
        _id: "5e4dcdfcc76d441afd3d29d9",
        name: "user_name",
        emailAddress: "email@address.com",
        password: "password",
        shortIds: []
      });

      await user.save();
      const token = jwt.sign(
        { userId: "5e4dcdfcc76d441afd3d29d9" },
        "wrongsecret"
      );
      const server = serverInit({ authorization: token });
      const { query } = createTestClient(server);
      const res = await query({ query: GQLquery.QUERY_ME });

      expect(res.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ message: "not authorized" })
        ])
      );
      expect(res.data).toBeNull();
    });
  });

  describe("query.login", () => {
    test("should return token for authenticated user", async () => {
      const password = await bcrypt.hash("password", 10);
      const user = new User({
        _id: "5e4dcdfcc76d441afd3d29d9",
        name: "user_name",
        emailAddress: "email@address.com",
        password: password,
        shortIds: []
      });

      await user.save();
      const server = serverInit();
      const { query } = createTestClient(server);
      const res = await query({
        query: GQLquery.QUERY_LOGIN,
        variables: { emailAddress: "email@address.com", password: "password" }
      });

      expect(res.errors).toBeUndefined();
      expect(res.data.login.userId).toMatchSnapshot();
    });

    test("should return validation error for invalid email address", async () => {
      const password = await bcrypt.hash("password", 10);
      const user = new User({
        _id: "5e4dcdfcc76d441afd3d29d9",
        name: "user_name",
        emailAddress: "email@address.com",
        password: password,
        shortIds: []
      });

      await user.save();
      const server = serverInit();
      const { query } = createTestClient(server);
      const res = await query({
        query: GQLquery.QUERY_LOGIN,
        variables: { emailAddress: "e@add", password: "password" }
      });

      expect(res.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            message: '"emailAddress" must be a valid email'
          })
        ])
      );
      expect(res.data).toBeNull();
    });

    test("should return validation error for invalid password", async () => {
      const password = await bcrypt.hash("password", 10);
      const user = new User({
        _id: "5e4dcdfcc76d441afd3d29d9",
        name: "user_name",
        emailAddress: "email@address.com",
        password: password,
        shortIds: []
      });

      await user.save();
      const server = serverInit();
      const { query } = createTestClient(server);
      const res = await query({
        query: GQLquery.QUERY_LOGIN,
        variables: { emailAddress: "email@address.com", password: "pass" }
      });

      expect(res.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            message: '"password" length must be at least 8 characters long'
          })
        ])
      );
      expect(res.data).toBeNull();
    });

    test("should return `user not found` for incorrect email address", async () => {
      const password = await bcrypt.hash("password", 10);
      const user = new User({
        _id: "5e4dcdfcc76d441afd3d29d9",
        name: "user_name",
        emailAddress: "email@address.com",
        password: password,
        shortIds: []
      });

      await user.save();
      const server = serverInit();
      const { query } = createTestClient(server);
      const res = await query({
        query: GQLquery.QUERY_LOGIN,
        variables: { emailAddress: "e@address.com", password: "password" }
      });

      expect(res.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ message: "user not found" })
        ])
      );
      expect(res.data).toBeNull();
    });

    test("should return `incorrect password` for wrong password", async () => {
      const password = await bcrypt.hash("password", 10);
      const user = new User({
        _id: "5e4dcdfcc76d441afd3d29d9",
        name: "user_name",
        emailAddress: "email@address.com",
        password: password,
        shortIds: []
      });

      await user.save();
      const server = serverInit();
      const { query } = createTestClient(server);
      const res = await query({
        query: GQLquery.QUERY_LOGIN,
        variables: {
          emailAddress: "email@address.com",
          password: "password123"
        }
      });

      expect(res.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ message: "incorrect password" })
        ])
      );
      expect(res.data).toBeNull();
    });
  });

  describe("query.expandUrl", () => {
    test("should return expanded url for valid short url", async () => {
      const shortUrl = new ShortUrl({
        _id: "zPH1DzaY",
        originalUrl: "https://www.example.com/"
      });

      await shortUrl.save();
      const server = serverInit();
      const { query } = createTestClient(server);
      const res = await query({
        query: GQLquery.QUERY_EXPAND_URL,
        variables: { shortId: "zPH1DzaY" }
      });

      expect(res.errors).toBeUndefined();
      expect(res.data).toMatchSnapshot();
    });

    test("should return expanded url for valid short url shared with the user", async () => {
      await db.writeDefaults();
      let names = ["user1", "user2", "user3"];
      let emails = ["email@address1", "email@address2", "email@address3"];
      let ids = [];
      for (let i = 0; i < 3; ++i) {
        const user = await User({
          name: names[i],
          emailAddress: emails[i],
          password: "password"
        });

        await user.save();

        ids.push(user._id);
      }

      const shortUrl = new ShortUrl({
        _id: "zPH1DzaY",
        originalUrl: "https://www.example.com/",
        shareWith: ids
      });

      await shortUrl.save();

      const token = jwt.sign({ userId: ids[1] }, process.env.USER_SECRET);
      const server = serverInit({ authorization: token });
      const { query } = createTestClient(server);

      const res = await query({
        query: GQLquery.QUERY_EXPAND_URL,
        variables: { shortId: "zPH1DzaY" }
      });

      expect(res.errors).toBeUndefined();
      expect(res.data).toMatchSnapshot();
    });

    test("should return `not authorized to view this url` for valid short url not shared with the user", async () => {
      await db.writeDefaults();
      let names = ["user1", "user2", "user3"];
      let emails = ["email@address1", "email@address2", "email@address3"];
      let ids = [];
      for (let i = 0; i < 3; ++i) {
        const user = await User({
          name: names[i],
          emailAddress: emails[i],
          password: "password"
        });

        await user.save();

        ids.push(user._id);
      }

      const shortUrl = new ShortUrl({
        _id: "zPH1DzaY",
        originalUrl: "https://www.example.com/",
        shareWith: ids
      });

      await shortUrl.save();

      const token = jwt.sign(
        { userId: process.env.ANONYMOUS_ID },
        process.env.USER_SECRET
      );
      const server = serverInit({ authorization: token });
      const { query } = createTestClient(server);

      const res = await query({
        query: GQLquery.QUERY_EXPAND_URL,
        variables: { shortId: "zPH1DzaY" }
      });

      expect(res.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ message: "not authorized" })
        ])
      );
      expect(res.data).toBeNull();
    });

    test("should return `invalid shortId` for invalid shortId", async () => {
      const shortUrl = new ShortUrl({
        _id: "zPH1DzaY",
        originalUrl: "https://www.example.com/"
      });

      await shortUrl.save();
      const server = serverInit();
      const { query } = createTestClient(server);
      const res = await query({
        query: GQLquery.QUERY_EXPAND_URL,
        variables: { shortId: "zPH1Dz" }
      });

      expect(res.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            message: "invalid shortId"
          })
        ])
      );
      expect(res.data).toBeNull();
    });
  });
});
