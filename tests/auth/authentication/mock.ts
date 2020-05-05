import JWT from "../../../src/core/JWT";
import * as authUtils from "../../../src/auth/authUtils";
import UserRepo from "../../../src/database/repository/UserRepo";
import KeystoreRepo from "../../../src/database/repository/KeystoreRepo";

export const ACCESS_TOKEN_KEY = "abc";
export const REFRESH_TOKEN_KEY = "xyz";

export const requestData = {
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

export const payload = {
	iss: "mythio",
	aud: "mythio",
	sub: "object_id",
	iat: Math.floor(Date.now() / 1000),
	exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
	prm: "foofoo"
} as any;

export const user = {
	name: "user_name",
	emailAddress: "user_email_address",
	password: "cool_long_ass_password",
	roles: [{ code: "USER" }],
	shortIds: [],
	createdAt: Date.now(),
	updatedAt: Date.now() - 40000
} as any;

export const keystore = {
	client: "client_id",
	primaryKey: "primary_key",
	secondaryKey: "secondary_key",
	createdAt: Date.now(),
	updatedAt: Date.now()
} as any;

export const spies = {
	JWT: {
		validate: jest.spyOn(JWT, "validate"),
		decode: jest.spyOn(JWT, "decode")
	},
	authUtils: {
		validateTokenData: jest.spyOn(authUtils, "validateTokenData"),
		createTokens: jest.spyOn(authUtils, "createTokens")
	},
	UserRepo: {
		findById: jest.spyOn(UserRepo, "findById")
	},
	KeystoreRepo: {
		findForKey: jest.spyOn(KeystoreRepo, "findForKey")
	}
};
