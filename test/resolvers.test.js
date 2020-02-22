require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createTestClient } = require("apollo-server-testing");

const db = require("./__utils__/db");
const User = require("../models/user");
const GQLquery = require("./__utils__/query");
const serverInit = require("./__utils__/server");
const ShortUrl = require("../models/shortUrl");

describe("Resolver", () => {
  describe("Query", () => {
    beforeAll(async () => {
      await db.connectToDB();
      await db.writeDefaults();
    });
    afterAll(async () => {
      await db.cleanDB();
      await db.disconnectDB();
    });

    describe("me", () => {
      test("should have correct query", async () => {
        const user = await User.findById("5e4dcdfcc76d441afd3d29d6");

        const token = jwt.sign({ userId: user._id }, process.env.USER_SECRET);
        const server = serverInit({ authorization: token });

        const { query } = createTestClient(server);
        const res = await query({ query: GQLquery.QUERY_ME });
        expect(res.errors).toBeUndefined();
        expect(res.data).toMatchSnapshot();
      });

      test("should return `not authorized` for invalid userId", async () => {
        const token = jwt.sign(
          { userId: "5e4dcdfcc76d441afd3d29d5" },
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

    describe("login", () => {
      test("should return token for authenticated user", async () => {
        const server = serverInit();
        const { query } = createTestClient(server);
        const res = await query({
          query: GQLquery.QUERY_LOGIN,
          variables: { emailAddress: "foo@bar.com", password: "password" }
        });

        expect(res.errors).toBeUndefined();
        expect(res.data.login.userId).toMatchSnapshot();
      });

      test("should return validation error for invalid email address", async () => {
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
        const server = serverInit();
        const { query } = createTestClient(server);
        const res = await query({
          query: GQLquery.QUERY_LOGIN,
          variables: { emailAddress: "foo@bar.com", password: "pass" }
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
        const server = serverInit();
        const { query } = createTestClient(server);
        const res = await query({
          query: GQLquery.QUERY_LOGIN,
          variables: {
            emailAddress: "foo@bar.com",
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

    describe("expandUrl", () => {
      test("should return expanded url for valid short url", async () => {
        const server = serverInit();
        const { query } = createTestClient(server);
        const res = await query({
          query: GQLquery.QUERY_EXPAND_URL,
          variables: { shortId: "4AItBPXz" }
        });

        expect(res.errors).toBeUndefined();
        expect(res.data).toMatchSnapshot();
      });

      test("should return expanded url for valid short url shared with the user", async () => {
        const token = jwt.sign(
          { userId: "5e4dcdfcc76d441afd3d29d7" },
          process.env.USER_SECRET
        );
        const server = serverInit({ authorization: token });
        const { query } = createTestClient(server);

        const res = await query({
          query: GQLquery.QUERY_EXPAND_URL,
          variables: { shortId: "4AItBPXz" }
        });

        expect(res.errors).toBeUndefined();
        expect(res.data).toMatchSnapshot();
      });

      test("should return `not authorized to view this url` for valid short url not shared with the user", async () => {
        const token = jwt.sign(
          { userId: "5e4dcdfcc76d441afd3d29d9" },
          process.env.USER_SECRET
        );
        const server = serverInit({ authorization: token });
        const { query } = createTestClient(server);

        const res = await query({
          query: GQLquery.QUERY_EXPAND_URL,
          variables: { shortId: "2BF2S1bc" }
        });

        expect(res.errors).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ message: "not authorized" })
          ])
        );
        expect(res.data).toBeNull();
      });

      test("should return `invalid shortId` for invalid shortId", async () => {
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
});
