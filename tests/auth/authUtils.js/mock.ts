export const ACCESS_TOKEN_KEY = "abc";
export const REFRESH_TOKEN_KEY = "xyz";

export const user = {
	name: "user_name",
	emailAddress: "user_email_address",
	password: "cool_long_ass_password",
	roles: [{ code: "USER" }] as any,
	shortIds: [],
	createdAt: Date.now(),
	updatedAt: Date.now() - 40000
} as any;
