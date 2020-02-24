require("dotenv").config();
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { createTestClient } = require("apollo-server-testing");

const db = require("./__utils__/db");
const User = require("../models/user");
const GQLmutation = require("./__utils__/mutation");
const serverInit = require("./__utils__/server");
const ShortUrl = require("../models/shortUrl");

describe("Mutation", () => {
  beforeAll(async () => {
    await db.connectToDB();
    await db.writeDefaults();
  });
  afterAll(async () => {
    await db.cleanDB();
    await db.disconnectDB();
  });

  describe("createUser", () => {
    test("should create and return a user", async () => {
      const server = serverInit();
      const { query } = createTestClient(server);
      const res = await query({
        mutation: GQLmutation.MUTATION_CREATE_USER,
        variables: {
          name: "Amit Parameshwar",
          emailAddress: "mythio.2909@gmail.com",
          password: "29A64Sept1"
        }
      });

      const user = await User.findById(res.data.createUser.userId);

      expect(res.errors).toBeUndefined();
      expect(user._doc).toMatchSnapshot({
        _id: expect.any(mongoose.Types.ObjectId),
        joiningDate: expect.any(Date),
        password: expect.any(String)
      });
    });

    test("should return validation error for invalid name", async () => {
      const server = serverInit();
      const { query } = createTestClient(server);
      const res = await query({
        mutation: GQLmutation.MUTATION_CREATE_USER,
        variables: {
          name: "Ami",
          emailAddress: "mythio.2909@gmail.com",
          password: "29A64Sept1"
        }
      });

      expect(res.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            message: '"name" length must be at least 4 characters long'
          })
        ])
      );
      expect(res.data).toBeNull();
    });

    test("should return validation error for invalid email address", async () => {
      const server = serverInit();
      const { query } = createTestClient(server);
      const res = await query({
        mutation: GQLmutation.MUTATION_CREATE_USER,
        variables: {
          name: "Amit Parameshwar",
          emailAddress: "mythio.2909@gma",
          password: "29A64Sept1"
        }
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
        mutation: GQLmutation.MUTATION_CREATE_USER,
        variables: {
          name: "Amit Parameshwar",
          emailAddress: "mythio.2909@gmail.com",
          password: "29A64S"
        }
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
  });

  describe("shortenUrl", () => {
    test("should return the shortUrl for the original url specified", async () => {
      const server = serverInit();
      const { query } = createTestClient(server);
      const res = await query({
        mutation: GQLmutation.MUTATITON_SHORTEN_URL,
        variables: {
          originalUrl: "https://google.com/301"
        }
      });

      expect(res.errors).toBeUndefined();
      expect(res.data).toMatchSnapshot();
    });
  });

  describe("editPrivilege", () => {
    test("should elevate the existing user's privilege", async () => {
      const token = jwt.sign(
        { userId: "5e4dcdfcc76d441afd3d29da" },
        process.env.USER_SECRET
      );
      const server = serverInit({ authorization: token });
      const { query } = createTestClient(server);
      const res = await query({
        mutation: GQLmutation.MUTATION_EDIT_PRIVILEGE,
        variables: {
          userId: "5e4dcdfcc76d441afd3d29d7",
          isAdmin: true
        }
      });

      expect(res.errors).toBeUndefined();
      expect(res.data).toMatchSnapshot();
      expect(res.data.editPrivilage).toEqual(
        expect.objectContaining({ isAdmin: true })
      );
    });

    test("should drop the existing user's privilege", async () => {
      const token = jwt.sign(
        { userId: "5e4dcdfcc76d441afd3d29da" },
        process.env.USER_SECRET
      );
      const server = serverInit({ authorization: token });
      const { query } = createTestClient(server);
      const res = await query({
        mutation: GQLmutation.MUTATION_EDIT_PRIVILEGE,
        variables: {
          userId: "5e4dcdfcc76d441afd3d29d7",
          isAdmin: false
        }
      });

      expect(res.errors).toBeUndefined();
      expect(res.data).toMatchSnapshot();
      expect(res.data.editPrivilage).toEqual(
        expect.objectContaining({ isAdmin: false })
      );
    });

    test("should throw `not authorized` if non-admin tries to elevate the privilege(s)", async () => {
      const token = jwt.sign(
        { userId: "5e4dcdfcc76d441afd3d29d8" },
        process.env.USER_SECRET
      );
      const server = serverInit({ authorization: token });
      const { query } = createTestClient(server);
      const res = await query({
        mutation: GQLmutation.MUTATION_EDIT_PRIVILEGE,
        variables: {
          userId: "5e4dcdfcc76d441afd3d29d7",
          isAdmin: true
        }
      });

      expect(res.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ message: "not authorized" })
        ])
      );
      expect(res.data).toBeNull();
    });

    test("should throw `user not found` if user is not found", async () => {
      const token = jwt.sign(
        { userId: "5e4dcdfcc76d441afd3d29da" },
        process.env.USER_SECRET
      );
      const server = serverInit({ authorization: token });
      const { query } = createTestClient(server);
      const res = await query({
        mutation: GQLmutation.MUTATION_EDIT_PRIVILEGE,
        variables: {
          userId: "5e4dcdfcc76d441afd3d2937",
          isAdmin: true
        }
      });

      expect(res.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ message: "user not found" })
        ])
      );
      expect(res.data).toBeNull();
    });
  });
});
