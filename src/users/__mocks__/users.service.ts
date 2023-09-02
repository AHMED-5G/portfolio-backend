import { userStubFactory } from "test/stubs/user.stub";
import { hashPassword } from "src/utils";
import { config } from "dotenv";
config();
export const UsersService = jest.fn().mockReturnValue({
  findOneByEmail: jest.fn().mockResolvedValue({
    id: userStubFactory().id,
    email: userStubFactory().email,
    password: hashPassword(userStubFactory().password),
  }),
});
