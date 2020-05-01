/* eslint-disable @typescript-eslint/no-explicit-any */
import { validateTokenData, createTokens, ruleStrategy } from "../../../src/auth/authUtils";
import { JwtPayload } from "../../../src/core/JWT";
import { tokenConfig } from "../../../src/core/config";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, user } from "./mock";
import { JwtSpy } from "../../mocks/JWT.mock";
import { authUtilsSpy } from "../../mocks/authUtils.mock";
import { UserRepoSpy } from "../../mocks/UserRepo.mock";
import { AuthFailureError, TokenExpiredError } from "../../../src/core/ApiError";
import { Types } from "mongoose";
import User from "../../../src/database/model/User";

describe("authUtils validateTokenData tests", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	afterAll(() => {
		jest.resetModules();
	});

	it("Should throw error when subject is not a valid userId", async () => {
		const payload = new JwtPayload(
			tokenConfig.issuer,
			tokenConfig.audience,
			"abc",
			ACCESS_TOKEN_KEY,
			tokenConfig.accessTokenValidityDays
		);

		try {
			validateTokenData(payload);
		} catch (err) {
			expect(err).toBeInstanceOf(AuthFailureError);
		}
	});

	it("Should throw error when access token key is different", async () => {
		const payload = new JwtPayload(
			tokenConfig.issuer,
			tokenConfig.audience,
			new Types.ObjectId().toHexString(),
			"123",
			tokenConfig.accessTokenValidityDays
		);

		try {
			validateTokenData(payload);
		} catch (err) {
			expect(err).toBeInstanceOf(AuthFailureError);
		}
	});

	it("Should return true if all data is correct", async () => {
		const payload = new JwtPayload(
			tokenConfig.issuer,
			tokenConfig.audience,
			new Types.ObjectId().toHexString(),
			ACCESS_TOKEN_KEY,
			tokenConfig.accessTokenValidityDays
		);

		try {
			const isPayloadValid = validateTokenData(payload);
			expect(isPayloadValid).toBe(true);
		} catch {
			//
		}
	});
});

describe("authUtils createTokens function", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	afterAll(() => {
		jest.resetModules();
	});

	it("Should process and return accessToken and refreshToken", async () => {
		const userId = new Types.ObjectId();
		const tokens = await createTokens({ _id: userId } as User, ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY);

		expect(tokens).toHaveProperty("accessToken");
		expect(tokens).toHaveProperty("refreshToken");
	});
});

describe("authUtils ruleStrategy function", () => {
	const requestData = {
		req: {
			cookies: {
				"refresh-token": "abc",
				"access-token": "xyz"
			}
		},
		res: {
			cookie: jest.fn()
		},
		user: {},
		keystore: {}
	} as any;
	const payload = {
		iss: "mythio",
		aud: "mythio",
		sub: "object_id",
		iat: Math.floor(Date.now() / 1000),
		exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
		prm: "foofoo"
	};

	beforeEach(() => {
		jest.clearAllMocks();
		JwtSpy.validate.mockClear();
		JwtSpy.validate.mockClear();
		JwtSpy.decode.mockClear();
		authUtilsSpy.validateTokenData.mockClear();
		UserRepoSpy.findById.mockClear();
	});

	it("Should throw error if tokens not specified", async () => {
		try {
			await ruleStrategy(requestData, "USER");
		} catch (err) {
			expect(err).toBeInstanceOf(AuthFailureError);
		}
	});

	it("Should use acces-token only iff it is valid", async () => {
		JwtSpy.validate.mockReturnValue(payload as any);

		try {
			await ruleStrategy(requestData, "USER");
		} catch (err) {
			//
		}

		expect(JwtSpy.validate).toBeCalledTimes(1);
	});

	it("Should make refresh-token if access-token is expired", async () => {
		JwtSpy.validate.mockRejectedValueOnce(new TokenExpiredError());
		JwtSpy.validate.mockReturnValue(payload as any);
		JwtSpy.decode.mockReturnValue(payload as any);
		authUtilsSpy.validateTokenData.mockReturnValue(undefined);
		UserRepoSpy.findById.mockReturnValue(user);

		try {
			await ruleStrategy(requestData, "USER");
		} catch (err) {
			//
		}
		expect(JwtSpy.validate).toBeCalledTimes(2);
		expect(JwtSpy.decode).toBeCalledTimes(1);
		expect(authUtilsSpy.validateTokenData).toBeCalledTimes(1);
		expect(UserRepoSpy.findById).toBeCalledTimes(1);
	});
});
