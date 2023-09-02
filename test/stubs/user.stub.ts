import { User } from "src/users/entities/user.entity";
import { RequestLoginSuccessObject } from "shared-data/constants/requestsData";

export const userStub: User = {
  id: 1,
  name: "name",
  email: "email",
  password: "password",
  userName: "userName",
};

export const loginSuccessObjectStub: RequestLoginSuccessObject = {
  jwt: "jwt",
};

export const userStubFactory = () => ({ ...userStub });
