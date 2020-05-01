/* eslint-disable @typescript-eslint/no-explicit-any */
import { validateTokenData, createTokens, ruleStrategy } from "../../../src/auth/authUtils";
import { JwtPayload } from "../../../src/core/JWT";
import { tokenConfig } from "../../../src/core/config";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "./mock";
import { JwtSpy } from "../../mocks/JWT.mock";
import { authUtilsSpy } from "../../mocks/authUtils.mock";
import { UserRepoSpy } from "../../mocks/UserRepo.mock";
import { AuthFailureError, TokenExpiredError } from "../../../src/core/ApiError";
import { Types } from "mongoose";
import User from "../../../src/database/model/User";
import Role from "../../../src/database/model/Role";

// describe("authUtils validateTokenData tests", () => {
// 	beforeAll(() => {
// 		jest.resetAllMocks();
// 	});

// 	it("Should throw error when subject is not a valid userId", async () => {
// 		const payload = new JwtPayload(
// 			tokenConfig.issuer,
// 			tokenConfig.audience,
// 			"abc",
// 			ACCESS_TOKEN_KEY,
// 			tokenConfig.accessTokenValidityDays
// 		);

// 		try {
// 			validateTokenData(payload);
// 		} catch (err) {
// 			expect(err).toBeInstanceOf(AuthFailureError);
// 		}
// 	});

// 	it("Should throw error when access token key is different", async () => {
// 		const payload = new JwtPayload(
// 			tokenConfig.issuer,
// 			tokenConfig.audience,
// 			new Types.ObjectId().toHexString(),
// 			"123",
// 			tokenConfig.accessTokenValidityDays
// 		);

// 		try {
// 			validateTokenData(payload);
// 		} catch (err) {
// 			expect(err).toBeInstanceOf(AuthFailureError);
// 		}
// 	});

// 	it("Should return true if all data is correct", async () => {
// 		const payload = new JwtPayload(
// 			tokenConfig.issuer,
// 			tokenConfig.audience,
// 			new Types.ObjectId().toHexString(),
// 			ACCESS_TOKEN_KEY,
// 			tokenConfig.accessTokenValidityDays
// 		);

// 		const isPayloadValid = validateTokenData(payload);
// 		expect(isPayloadValid).toBe(true);
// 	});
// });

// describe("authUtils createTokens function", () => {
// 	beforeAll(() => {
// 		jest.resetAllMocks();
// 	});

// 	it("Should process and return accessToken and refreshToken", async () => {
// 		const userId = new Types.ObjectId();

// 		const tokens = await createTokens({ _id: userId } as User, ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY);

// 		expect(tokens).toHaveProperty("accessToken");
// 		expect(tokens).toHaveProperty("refreshToken");
// 	});
// });

describe.only("authUtils ruleStrategy function", () => {
	let requestData;
	let payload;

	beforeAll(() => {
		jest.resetModules();
		payload = {
			iss: "mythio",
			aud: "mythio",
			sub: "object_id",
			iat: Math.floor(Date.now() / 1000),
			exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
			prm: "foofoo"
		};
		requestData = {
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
		};
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("Should throw error if tokens not specified", async () => {
		try {
			await ruleStrategy(requestData, "USER");
		} catch (err) {
			expect(err).toBeInstanceOf(AuthFailureError);
		}
	});

	it.only("Should make refresh-token if access-token is expired", async () => {
		JwtSpy.validate.mockRejectedValueOnce(new TokenExpiredError());
		JwtSpy.validate.mockReturnValue(payload);
		JwtSpy.decode.mockReturnValue(payload);
		authUtilsSpy.validateTokenData.mockReturnValue(undefined);
		UserRepoSpy.findById.mockReturnValue(
			Promise.resolve({
				name: "string",
				emailAddress: "string",
				password: "string",
				roles: [{ code: "USER" }] as Role[],
				shortIds: [],
				createdAt: Date.now(),
				updatedAt: Date.now()
			} as any)
		);
		try {
			await ruleStrategy(requestData, "USER");
		} catch (err) {
			//
		}
		expect(JwtSpy.validate).toBeCalledTimes(2);
		expect(authUtilsSpy.validateTokenData).toBeCalledTimes(1);
		expect(UserRepoSpy.findById).toBeCalled();
	});
});
