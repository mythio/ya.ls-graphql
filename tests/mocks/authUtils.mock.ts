import * as authUtils from "../../src/auth/authUtils";

const validateTokenData = jest.spyOn(authUtils, "validateTokenData");
const createTokens = jest.spyOn(authUtils, "createTokens");
const ruleStrategy = jest.spyOn(authUtils, "ruleStrategy");

export const authUtilsSpy = {
	validateTokenData,
	createTokens,
	ruleStrategy
};
