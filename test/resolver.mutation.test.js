require("dotenv").config();
const jwt = require("jsonwebtoken");
const { createTestClient } = require("apollo-server-testing");

const db = require("./__utils__/db");
const User = require("../models/user");
const GQLmutation = require("./__utils__/mutation");
const serverInit = require("./__utils__/server");

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
    it("should create and return a user", async () => {
      const server = serverInit();
      const { query } = createTestClient(server);
      const res = await query({
        mutation: GQLmutation.MUTATION_CREATE_USER,
        variables: {
          name: "Amit Parameshwar",
          emailAddress: "mythio.2909@gmail.com",
          password: "very_strong_password"
        }
      });

      expect(res.data).toMatchSnapshot();
      expect(res.errors).toBeUndefined();
    });

    it("should return error for existing mail id", async () => {
      const server = serverInit();
      const { query } = createTestClient(server);
      const res = await query({
        mutation: GQLmutation.MUTATION_CREATE_USER,
        variables: {
          name: "Amit",
          emailAddress: "email@address1.com",
          password: "very_strong_password"
        }
      });

      expect(res.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            message: "User already exists"
          })
        ])
      );
      expect(res.data).toBeNull();
    });

    it("should return validation error for invalid name", async () => {
      const server = serverInit();
      const { query } = createTestClient(server);
      const res = await query({
        mutation: GQLmutation.MUTATION_CREATE_USER,
        variables: {
          name: "Ami",
          emailAddress: "mythio.2909@gmail.com",
          password: "very_strong_password"
        }
      });

      expect(res.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            message: 'Field "name" must be a string of atleast 4 characters'
          })
        ])
      );
      expect(res.data).toBeNull();
    });

    it("should return validation error for invalid email address", async () => {
      const server = serverInit();
      const { query } = createTestClient(server);
      const res = await query({
        mutation: GQLmutation.MUTATION_CREATE_USER,
        variables: {
          name: "Amit Parameshwar",
          emailAddress: "mythio.2909@gma",
          password: "very_strong_password"
        }
      });

      expect(res.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            message: 'Field "emailAddress" must be a valid email address'
          })
        ])
      );
      expect(res.data).toBeNull();
    });

    it("should return validation error for invalid password", async () => {
      const server = serverInit();
      const { query } = createTestClient(server);
      const res = await query({
        mutation: GQLmutation.MUTATION_CREATE_USER,
        variables: {
          name: "Amit Parameshwar",
          emailAddress: "mythio.2909@gmail.com",
          password: "weak"
        }
      });

      expect(res.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            message: 'Field "password" must be a string of atleast 8 characters'
          })
        ])
      );
      expect(res.data).toBeNull();
    });
  });

  describe("verifyUser", () => {
    it("should set isVerified for the user", async () => {
      const userId = "5e4dcdfcc76d441afd3d29da";
      const token = jwt.sign({ userId }, process.env.USER_SECRET);

      const server = serverInit();
      const { query } = createTestClient(server);
      const res = await query({
        mutation: GQLmutation.MUTATION_VERIFY_USER,
        variables: {
          token
        }
      });

      const user = await User.findById(userId);

      expect(res.errors).toBeUndefined();
      expect(user._doc).toHaveProperty("isVerified", true);
    });

    it("should return 'invalid signature' for invalid token in verification link", async () => {
      const userId = "5e4dcdfcc76d441afd3d29da";
      let token = jwt.sign({ userId }, process.env.USER_SECRET);

      token += "2";

      const server = serverInit();
      const { query } = createTestClient(server);
      const res = await query({
        mutation: GQLmutation.MUTATION_VERIFY_USER,
        variables: {
          token
        }
      });

      expect(res.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            message: "invalid signature"
          })
        ])
      );
      expect(res.data).toBeNull();
    });
  });

  describe("shortenUrl", () => {
    it("should return the shortUrl for the original url specified", async () => {
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

    it("should return `error` for wrong url", async () => {
      const server = serverInit();
      const { query } = createTestClient(server);
      const res = await query({
        mutation: GQLmutation.MUTATITON_SHORTEN_URL,
        variables: {
          originalUrl: "htps://google.com/404"
        }
      });

      expect(res.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            message: 'Error: Field "originalUrl" must be a valid url'
          })
        ])
      );
      expect(res.data).toBeNull();
    });
  });

  describe("editPrivilege", () => {
    it("should elevate the existing user's privilege", async () => {
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
      expect(res.data.editPrivilege).toEqual(
        expect.objectContaining({ isAdmin: true })
      );
    });

    it("should drop the existing user's privilege", async () => {
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
      expect(res.data.editPrivilege).toEqual(
        expect.objectContaining({ isAdmin: false })
      );
    });

    it("should throw `not authorized` if non-admin tries to elevate the privilege(s)", async () => {
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

    it("should throw `user not found` if user is not found", async () => {
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

  describe("deleteUser", () => {
    it("[non-admin - missmatch-id] should return 'cannot delete the user'", async () => {
      const token = jwt.sign(
        { userId: "5e4dcdfcc76d441afd3d29d7" },
        process.env.USER_SECRET
      );
      const server = serverInit({ authorization: token });
      const { query } = createTestClient(server);
      const res = await query({
        mutation: GQLmutation.MUTATION_DELETE_USER,
        variables: {
          userId: "5e4dcdfcc76d441afd3d29d2"
        }
      });

      expect(res.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ message: "cannot delete the user" })
        ])
      );
    });

    it("[non-admin - matching-id] should delete the user", async () => {
      const token = jwt.sign(
        { userId: "5e4dcdfcc76d441afd3d29d9" },
        process.env.USER_SECRET
      );
      const server = serverInit({ authorization: token });
      const { query } = createTestClient(server);
      const res = await query({
        mutation: GQLmutation.MUTATION_DELETE_USER,
        variables: {
          userId: "5e4dcdfcc76d441afd3d29d9"
        }
      });

      expect(res.errors).toBeUndefined();
      expect(res.data.deleteUser).toBe(
        "Deleted 1 user(s) and cleaned 0 artifact(s)"
      );
    });

    it("[admin - missmatch-id] should delete the user", async () => {
      const token = jwt.sign(
        { userId: "5e4dcdfcc76d441afd3d29da" },
        process.env.USER_SECRET
      );
      const server = serverInit({ authorization: token });
      const { query } = createTestClient(server);
      const res = await query({
        mutation: GQLmutation.MUTATION_DELETE_USER,
        variables: {
          userId: "5e4dcdfcc76d441afd3d29d7"
        }
      });

      expect(res.errors).toBeUndefined();
      expect(res.data.deleteUser).toBe(
        "Deleted 1 user(s) and cleaned 1 artifact(s)"
      );
    });
  });
});
