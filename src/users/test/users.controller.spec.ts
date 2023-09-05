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
import { MeSuccessObject } from "shared-data/constants/requestsData";
import { MeUserResponse } from "../dto/user.dto";
import { MyJwtSigner } from "src/utils";

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
            save: jest.fn(),
            create: jest.fn(),
          },
        },
        JwtService,
        {
          provide: getRepositoryToken(JwtService),
          useValue: {
            sign: jest.fn().mockResolvedValue("token"),
          },
          useClass: MyJwtSigner,
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
    jwtService = moduleRef.get<JwtService>(JwtService);
    // Mock the bcrypt library
    jest.mock("bcrypt", () => ({
      compareSync: jest.fn().mockReturnValue(true),
    }));
    jest.clearAllMocks();
  });

  it("should be defined controller ", () => {
    expect(userController).toBeDefined();
  });

  it("should be defined service ", () => {
    expect(userService).toBeDefined();
  });

  describe("login", () => {
    let jwt: JSONWebTokenType;
    describe("when get user is called", () => {
      beforeEach(async () => {
        const response = await userController.login({
          email: userStubFactory().email,
          password: userStubFactory().password,
        });

        jwt = response.data.jwt;
      });

      test("should call user service -> findOneByEmail", () => {
        expect(userService.findOneByEmail).toBeCalledWith(
          userStubFactory().email,
        );
      });

      test("should return equals jwt", async () => {
        const myNewJwt = await jwtService.signAsync(
          { id: userStubFactory().id },
          {
            secret: process.env.JWT_SECRET,
          },
        );

        expect(jwt).toEqual(myNewJwt);
      });
    });
  });

  describe("me", () => {
    let user: MeSuccessObject;

    beforeEach(async () => {
      const signToken = jwtService.sign(
        {
          id: userStubFactory().id,
        },
        {
          secret: process.env.JWT_SECRET,
        },
      );

      const response = await userController.me("Bearer " + signToken);
      user = response.data;
    });

    test("should call user service -> findOne", () => {
      expect(userService.findOne).toBeCalledWith(userStubFactory().id);
    });

    it("should return user", () => {
      const expectedUser = userStubFactory();
      delete expectedUser.password;
      expect(user).toEqual(expectedUser);
    });

    //it should return user as type of MeUserResponse
    it("should return user as type of MeUserResponse", () => {
      expect(user).toBeInstanceOf(MeUserResponse);
    });

    // user object shouldn't have password
    it("should not have password", () => {
      expect(user).not.toHaveProperty("password");
    });
  });

  describe("register", () => {
    beforeEach(async () => {
      await userController.register({
        email: userStubFactory().email,
        password: userStubFactory().password,
      });
    });

    it("should call user service with correct data", async () => {
      // Example pattern for bcrypt hashed passwords
      const hashedPasswordPattern = /^\$2[ayb]\$.{56}$/;

      expect(userService.create).toBeCalledWith({
        email: userStubFactory().email,
        password: expect.stringMatching(hashedPasswordPattern),
      });
    });
  });
});
