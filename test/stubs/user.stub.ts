import { RequestLoginSuccessObject } from "shared-data/constants/requestsData";
import { IUser } from "shared-data/types";

export const userStub: IUser = {
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
