/* eslint-disable @typescript-eslint/no-explicit-any */
import _ from "lodash";
import { validateTokenData, createTokens } from "../../../src/auth/authUtils";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, payload, spies } from "./mock";
import { AuthFailureError, InternalError } from "../../../src/core/ApiError";
import { Types } from "mongoose";
import User from "../../../src/database/model/User";

describe("authUtils validateTokenData tests", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	afterAll(() => {
		jest.clearAllMocks();
	});

	it("Should throw error when subject is not a valid userId", async () => {
		const reqPayload = _.cloneDeep(payload);
		reqPayload.sub = "abc";
		try {
			validateTokenData(reqPayload);
		} catch (err) {
			expect(err).toBeInstanceOf(AuthFailureError);
		}
	});
});

describe("authUtils createTokens function", () => {
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
		const tokens = await createTokens({ _id: userId } as User, ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY);

		expect(tokens).toHaveProperty("accessToken");
		expect(tokens).toHaveProperty("refreshToken");
	});
});
