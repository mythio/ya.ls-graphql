import { readFileSpy } from "./mock";
import JWT, { JwtPayload } from "../../../src/core/JWT";
import { BadTokenError } from "../../../src/core/ApiError";

describe("JWT class tests", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	afterAll(() => {
		jest.clearAllMocks();
		jest.restoreAllMocks();
	});

	const issuer = "issuer";
	const audience = "audience";
	const subject = "subject";
	const param = "param";
	const validity = 1;
	let token: string;

	it("Should throw error for invalid token in JWT.decode", async () => {
		try {
			await JWT.decode("abc");
		} catch (err) {
			expect(err).toBeInstanceOf(BadTokenError);
		}
		expect(readFileSpy).toBeCalledTimes(1);
	});

	it("Should generate a token for JWT.encode", async () => {
		const payload = new JwtPayload(issuer, audience, subject, param, validity);
		token = await JWT.encode(payload);

		expect(typeof token).toBe("string");
		expect(readFileSpy).toBeCalledTimes(1);
	});

	it("Should throw error for expired token in JWT.validate", async () => {
		try {
			await JWT.validate("abc");
		} catch (err) {
			expect(err).toBeInstanceOf(BadTokenError);
		}
		expect(readFileSpy).toBeCalledTimes(1);
	});

	it("Should validate correct token", async () => {
		try {
			const res = await JWT.validate(token);
			expect(res).toMatchObject(JwtPayload);
		} catch {}
		expect(readFileSpy).toBeCalledTimes(1);
	});
});
