import KeystoreRepo from "../../src/database/repository/KeystoreRepo";

const find = jest.spyOn(KeystoreRepo, "find");
const findForKey = jest.spyOn(KeystoreRepo, "findForKey");
const remove = jest.spyOn(KeystoreRepo, "remove");
const create = jest.spyOn(KeystoreRepo, "create");

export const KeystoreRepoSpy = {
	find,
	findForKey,
	remove,
	create
};
