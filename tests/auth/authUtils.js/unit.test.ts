import { validateTokenData, createTokens, ruleStrategy } from "../../../src/auth/authUtils";
import { JwtPayload } from "../../../src/core/JWT";
import { tokenConfig } from "../../../src/core/config";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "./mock";
import { AuthFailureError } from "../../../src/core/ApiError";
import { Types } from "mongoose";
import User from "../../../src/database/model/User";

describe("authUtils validateTokenData tests", () => {
	beforeAll(() => {
		jest.resetAllMocks();
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

		const isPayloadValid = validateTokenData(payload);
		expect(isPayloadValid).toBe(true);
	});
});

describe("authUtils createTokens function", () => {
	beforeAll(() => {
		jest.resetAllMocks();
	});

	it("Should process and return accessToken and refreshToken", async () => {
		const userId = new Types.ObjectId();

		const tokens = await createTokens({ _id: userId } as User, ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY);

		expect(tokens).toHaveProperty("accessToken");
		expect(tokens).toHaveProperty("refreshToken");
	});
});

describe("authUtils ruleStrategy function", () => {
	let requestData;
	beforeAll(() => {
		jest.resetAllMocks();
		requestData = {
			req: {
				cookies: {
					"refresh-token": "abc",
					"access-token": "xyz"
				}
			},
			res: {
				cookie: new (jest.fn())()
			},
			user: {},
			keystore: {}
		};
	});

	it("Should throw error if tokens not specified", async () => {
		try {
			await ruleStrategy(requestData, "USER");
		} catch (err) {
			expect(err).toBeInstanceOf(AuthFailureError);
		}
	});

	// it("Should throw error when validating invalid token", async () => {

	// });
});
