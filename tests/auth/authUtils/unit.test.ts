/* eslint-disable @typescript-eslint/no-explicit-any */
import _ from "lodash";
import { validateTokenData, createTokens } from "../../../src/auth/authUtils";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, payload, spies } from "./mock";
import { AuthFailureError, InternalError } from "../../../src/core/ApiError";
import { Types } from "mongoose";
import User from "../../../src/database/model/User";

describe("authUtils", () => {
	beforeAll(() => {
		jest.clearAllMocks();
	});

	afterAll(() => {
		jest.restoreAllMocks();
	});

	describe("validateTokenData function", () => {
		beforeEach(() => {
			jest.clearAllMocks();
		});

		afterAll(() => {
			jest.clearAllMocks();
		});

		it("Should return false when  payload is not valid", () => {
			const reqPayload = _.cloneDeep(payload);
			reqPayload.sub = "abc";
			const res = validateTokenData(reqPayload);
			expect(res).toBe(false);
		});

		it("Should return true when payload is valid", () => {
			const reqPayload = _.cloneDeep(payload);
			const res = validateTokenData(reqPayload);
			expect(res).toBe(true);
		});
	});

	describe("createTokens function", () => {
		beforeEach(() => {
			jest.clearAllMocks();
		});

		afterAll(() => {
			jest.clearAllMocks();
		});

		it("Should throw error if accessToken and refreshToken are not generated", async () => {
			const userId = new Types.ObjectId();
			spies.JWT.encode.mockResolvedValue(undefined);
			try {
				await createTokens({ _id: userId } as User, ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY);
			} catch (err) {
				expect(err).toBeInstanceOf(InternalError);
			}

			expect(spies.JWT.encode).toBeCalled();
		});

		it("Should process and return accessToken and refreshToken", async () => {
			jest.restoreAllMocks();
			const userId = new Types.ObjectId();
			const tokens = await createTokens(
				{ _id: userId } as User,
				ACCESS_TOKEN_KEY,
				REFRESH_TOKEN_KEY
			);

			expect(tokens).toHaveProperty("accessToken");
			expect(tokens).toHaveProperty("refreshToken");
		});
	});
});
