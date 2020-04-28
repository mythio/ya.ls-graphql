import fs from "fs";

export const requestData = {
	cookies: {
		"refresh-token": "abc",
		"access-token": "xyz"
	},
	res: {
		cookie: new (jest.fn())()
	},
	user: {},
	keystore: {}
};

export const readFileSpy = jest.spyOn(fs, "readFile");
