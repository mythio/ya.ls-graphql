import { RoleModel } from '../model/Role';

export const seed = async () => {
  await RoleModel.insertMany([
    { code: "REVIEWER" },
    { code: 'USER' },
    { code: "ADMIN" }
  ]);
};