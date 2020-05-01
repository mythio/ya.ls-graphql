import JWT from "../../src/core/JWT";

const encode = jest.spyOn(JWT, "encode");
const validate = jest.spyOn(JWT, "validate");
const decode = jest.spyOn(JWT, "decode");

export const JwtSpy = {
	encode,
	validate,
	decode
};
