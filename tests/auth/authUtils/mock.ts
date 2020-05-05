import { Types } from "mongoose";
import { tokenConfig } from "../../../src/core/config";
import JWT from "../../../src/core/JWT";

export const ACCESS_TOKEN_KEY = "abc";
export const REFRESH_TOKEN_KEY = "xyz";

export const payload = {
	iss: tokenConfig.issuer,
	aud: tokenConfig.audience,
	sub: new Types.ObjectId().toHexString(),
	prm: ACCESS_TOKEN_KEY,
	iat: tokenConfig.accessTokenValidityDays
} as any;

const encode = jest.spyOn(JWT, "encode");
const validate = jest.spyOn(JWT, "validate");
const decode = jest.spyOn(JWT, "decode");

export const spies = {
	JWT: {
		encode,
		validate,
		decode
	}
};
