import UserRepo from "../../src/database/repository/UserRepo";

const findById = jest.spyOn(UserRepo, "findById");
const findByEmail = jest.spyOn(UserRepo, "findByEmail");

export const UserRepoSpy = {
	findById,
	findByEmail
};
