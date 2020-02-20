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

    test("should return `user not found` for invalid email address", async () => {
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
    test("should return expanded url for valid short url (un-authenticated)", async () => {
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
  });
});
