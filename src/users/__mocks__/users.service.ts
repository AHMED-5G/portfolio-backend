import { config } from "dotenv";
import { hashPassword } from "src/utils";
import { userStubFactory } from "test/stubs/user.stub";

config();
export const UsersService = jest.fn().mockReturnValue({
  findOneByEmail: jest.fn().mockResolvedValue({
    id: userStubFactory().id,
    email: userStubFactory().email,
    password: hashPassword(userStubFactory().password),
  }),
  findOne: jest.fn().mockResolvedValue({
    ...userStubFactory(),
    password: hashPassword(userStubFactory().password),
  }),
});
