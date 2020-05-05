/* eslint-disable @typescript-eslint/no-explicit-any */
import _ from "lodash";
import { ruleStrategy } from "../../../src/auth/authentication";
import { NotFoundError, AuthFailureError, TokenExpiredError } from "../../../src/core/ApiError";
import { payload, user, keystore, requestData, spies } from "./mock";

describe("authentication", () => {
	beforeAll(() => {
		jest.clearAllMocks();
	});

	afterAll(() => {
		jest.restoreAllMocks();
	});

	describe("ruleStrategy function", () => {
		beforeEach(() => {
			jest.clearAllMocks();
		});

		afterAll(() => {
			jest.clearAllMocks();
		});

		it("Should throw error if refresh-token and access-token don't exist", async () => {
			const reqPayload = _.cloneDeep(requestData);
			reqPayload.req.cookies["refresh-token"] = undefined;

			try {
				await ruleStrategy(reqPayload, "USER");
			} catch (err) {
				expect(err).toBeInstanceOf(AuthFailureError);
			}
		});

		it("Should throw error if access-token in invalid", async () => {
			const reqPayload = _.cloneDeep(requestData);
			spies.JWT.validate.mockRejectedValue(new Error());
			try {
				await ruleStrategy(reqPayload, "USER");
			} catch (err) {
				expect(err).toBeInstanceOf(AuthFailureError);
			}
			expect(spies.JWT.validate).toBeCalledTimes(1);
		});

		it("Should create refresh-token if access-token is expired", async () => {
			const reqPayload = _.cloneDeep(requestData);
			const refreshTokenPayload = _.cloneDeep(payload);
			refreshTokenPayload.sub = "different_object_id";
			spies.JWT.validate.mockRejectedValueOnce(new TokenExpiredError());
			spies.JWT.decode.mockResolvedValue(payload);
			spies.JWT.validate.mockResolvedValue(refreshTokenPayload);

			try {
				await ruleStrategy(reqPayload, "USER");
			} catch (err) {
				expect(err).toBeInstanceOf(AuthFailureError);
			}

			expect(spies.JWT.validate).toBeCalledTimes(2);
		});

		it("Should throw error if generated access-token is not valid", async () => {
			spies.JWT.validate.mockReturnValue(payload);
			spies.authUtils.validateTokenData.mockReturnValue(false);

			try {
				await ruleStrategy(requestData, "USER");
			} catch (err) {
				expect(err).toBeInstanceOf(AuthFailureError);
			}

			expect(spies.JWT.validate).toBeCalledTimes(1);
			expect(spies.authUtils.validateTokenData).toBeCalledTimes(1);
		});

		it("Should throw error if user is not found", async () => {
			spies.JWT.validate.mockResolvedValue(payload as any);
			spies.authUtils.validateTokenData.mockResolvedValue(undefined as never);
			spies.UserRepo.findById.mockResolvedValue(undefined);

			try {
				await ruleStrategy(requestData, "USER");
			} catch (err) {
				expect(err).toBeInstanceOf(NotFoundError);
			}

			expect(spies.JWT.validate).toBeCalledTimes(1);
			expect(spies.authUtils.validateTokenData).toBeCalledTimes(1);
			expect(spies.UserRepo.findById).toBeCalledTimes(1);
		});

		it("Should throw error if role is not authorized", async () => {
			user.roles = ["USER_UNAUTH"];
			spies.JWT.validate.mockReturnValue(payload as any);
			spies.authUtils.validateTokenData.mockReturnValue(payload as any);
			spies.UserRepo.findById.mockReturnValue(user);

			try {
				await ruleStrategy(requestData, "USER");
			} catch (err) {
				expect(err).toBeInstanceOf(AuthFailureError);
			}

			expect(spies.JWT.validate).toBeCalledTimes(1);
			expect(spies.authUtils.validateTokenData).toBeCalledTimes(1);
			expect(spies.UserRepo.findById).toBeCalledTimes(1);
		});

		it("Should throw error if key is not found", async () => {
			user.roles = [{ code: "USER" }];
			spies.JWT.validate.mockReturnValue(payload as any);
			spies.authUtils.validateTokenData.mockReturnValue(payload as any);
			spies.UserRepo.findById.mockReturnValue(user);
			spies.KeystoreRepo.findForKey.mockReturnValue(undefined);

			try {
				await ruleStrategy(requestData, "USER");
			} catch (err) {
				expect(err).toBeInstanceOf(AuthFailureError);
			}

			expect(spies.JWT.validate).toBeCalledTimes(1);
			expect(spies.authUtils.validateTokenData).toBeCalledTimes(1);
			expect(spies.UserRepo.findById).toBeCalledTimes(1);
			expect(spies.KeystoreRepo.findForKey).toBeCalledTimes(1);
		});

		it("Should return without errors iff role is authorized", async () => {
			spies.JWT.validate.mockReturnValue(payload);
			spies.authUtils.validateTokenData.mockReturnValue(true);
			spies.UserRepo.findById.mockReturnValue(user);
			spies.KeystoreRepo.findForKey.mockReturnValue(keystore);

			await ruleStrategy(requestData, "USER");

			expect(spies.JWT.validate).toBeCalledTimes(1);
			expect(spies.authUtils.validateTokenData).toBeCalledTimes(1);
			expect(spies.UserRepo.findById).toBeCalledTimes(1);
		});

		// it("Should make refresh-token if access-token is expired", async () => {
		// 	spies.JWT.validate.mockRejectedValueOnce(new TokenExpiredError());
		// 	spies.JWT.validate.mockReturnValue(payload as any);
		// 	spies.JWT.decode.mockReturnValue(payload as any);
		// 	spies.authUtils.validateTokenData.mockReturnValue(undefined);
		// 	spies.UserRepo.findById.mockReturnValue(user);

		// 	await ruleStrategy(requestData, "USER");

		// 	expect(spies.JWT.validate).toBeCalledTimes(2);
		// 	expect(spies.JWT.decode).toBeCalledTimes(1);
		// 	expect(spies.authUtils.validateTokenData).toBeCalledTimes(1);
		// 	expect(spies.UserRepo.findById).toBeCalledTimes(1);
		// });
	});
});
