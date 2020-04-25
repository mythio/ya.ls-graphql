import { readFileSpy } from "./mock";
import JWT, { JwtPayload } from "../../../src/core/JWT";
import { JsonWebTokenError } from "jsonwebtoken";

describe(`JWT class tests`, () => {
	beforeEach(() => {
		readFileSpy.mockClear();
	});

	const issuer = "issuer";
	const audience = "audience";
	const subject = "subject";
	const param = "param";
	const validity = 1;

	it(`should throw error for invalid token in JWT.decode`, async () => {
		try {
			await JWT.decode("abc");
		} catch (err) {
			expect(err).toBeInstanceOf(JsonWebTokenError);
		}
		expect(readFileSpy).toBeCalledTimes(1);
	});

	it("Should generate a token for JWT.encode", async () => {
		const payload = new JwtPayload(issuer, audience, subject, param, validity);
		const token = await JWT.encode(payload);

		expect(typeof token).toBe("string");
		expect(readFileSpy).toBeCalledTimes(1);
	});
});
