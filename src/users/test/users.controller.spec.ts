//https://www.youtube.com/watch?v=1Vc6Xw8FMpg
import { UsersController } from "../users.controller";
import { Test } from "@nestjs/testing";
import { UsersService } from "../users.service";
import { User } from "../entities/user.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ResetToken } from "../entities/resetToken.entity";
import { JwtService } from "@nestjs/jwt";
import { userStubFactory } from "test/stubs/user.stub";
import { JSONWebTokenType } from "shared-data/types";

jest.mock("../users.service");

describe("UsersController", () => {
  let userController: UsersController;
  let userService: UsersService;
  let jwtService: JwtService;
  const USER_REPOSITORY_TOKEN = getRepositoryToken(User);

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: {
            // getUserById: jest.fn(),
            findOne: jest.fn(),
          },
        },
        JwtService,
        {
          provide: getRepositoryToken(JwtService),
          useValue: {},
        },
        ResetToken,
        {
          provide: getRepositoryToken(ResetToken),
          useValue: {},
        },
      ],
    }).compile();
    userController = moduleRef.get<UsersController>(UsersController);
    userService = moduleRef.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  it("should be defined controller ", () => {
    expect(userController).toBeDefined();
  });

  it("should be defined service ", () => {
    expect(userService).toBeDefined();
  });

  //   describe("getUserById", () => {
  //     describe("when get user is called", () => {
  //       let user: User;
  //       beforeEach(async () => {
  //         user = (await userController.getUserById(userStubFactory().id)).data;
  //       });

  //       console.log("users.controller.spec.ts -> ", user);
  //       test("should call user service", () => {
  //         expect(userService.findOne).toBeCalledWith(userStubFactory().id);
  //       });

  //       test("should return user", () => {
  //         expect(user).toEqual({
  //           userName: "AA",
  //         });
  //         // expect(user).toEqual(userStubFactory());
  //       });
  //     });
  //   });

  describe("login", () => {
    let jwt: JSONWebTokenType;
    describe("when get user is called", () => {
      //   let data: { jwt: JSONWebTokenType };

      //   let jwt: JSONWebTokenType;
      beforeEach(async () => {
        const response = await userController.login({
          email: userStubFactory().email,
          password: userStubFactory().password,
        });
        //   .then((response) => console.log(response.data));
        jwt = response.data.jwt;
      });

      test("should call user service -> findOneByEmail", () => {
        expect(userService.findOneByEmail).toBeCalledWith(
          userStubFactory().email,
        );
      });

      //test its return ali jwt
      test("should return jwt", () => {
        // expect(jwt).toEqual(jwtService.signAsync({ id: 1 }));
      });
    });
  });
});
