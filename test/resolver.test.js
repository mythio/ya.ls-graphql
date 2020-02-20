require("dotenv").config();
const gql = require("graphql-tag");
const jwt = require("jsonwebtoken");
const { createTestClient } = require("apollo-server-testing");

const db = require("./utils/db");
const User = require("../models/user");
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
        password: "123123123",
        shortIds: []
      });

      await user.save();

      const QUERY_ME = gql`
        query {
          me {
            userId
            name
            emailAddress
            shortIds {
              shortId
              originalUrl
            }
          }
        }
      `;

      const token = jwt.sign({ userId: user._id }, process.env.USER_SECRET);

      const server = serverInit({ authorization: token });

      const { query } = createTestClient(server);
      const res = await query({ query: QUERY_ME });
      expect(res.errors).toBeUndefined();
      expect(res.data).toMatchSnapshot();
    });

    test("should return `not authorized` for invalid userId", async () => {
      const user = new User({
        _id: "5e4dcdfcc76d441afd3d29d9",
        name: "user_name",
        emailAddress: "email@address.com",
        password: "123123123",
        shortIds: []
      });

      await user.save();

      const QUERY_ME = gql`
        query {
          me {
            userId
            name
            emailAddress
            shortIds {
              shortId
              originalUrl
            }
          }
        }
      `;

      const token = jwt.sign(
        { userId: "5e4dcdfcc76d441afd3d29d6" },
        process.env.USER_SECRET
      );

      const server = serverInit({ authorization: token });

      const { query } = createTestClient(server);
      const res = await query({ query: QUERY_ME });

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
        password: "123123123",
        shortIds: []
      });

      await user.save();

      const QUERY_ME = gql`
        query {
          me {
            userId
            name
            emailAddress
            shortIds {
              shortId
              originalUrl
            }
          }
        }
      `;

      const token = jwt.sign(
        { userId: "5e4dcdfcc76d441afd3d29d9" },
        "wrongsecret"
      );

      const server = serverInit({ authorization: token });

      const { query } = createTestClient(server);
      const res = await query({ query: QUERY_ME });

      expect(res.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ message: "not authorized" })
        ])
      );
      expect(res.data).toBeNull();
    });
  });
});
