import * as authUtils from "../../src/auth/authUtils";

const validateTokenData = jest.spyOn(authUtils, "validateTokenData");
const createTokens = jest.spyOn(authUtils, "createTokens");

export const authUtilsSpy = {
	validateTokenData,
	createTokens
};
