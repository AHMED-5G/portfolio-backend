//https://www.youtube.com/watch?v=XbSZnGCJB2I
import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "../users.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "../entities/user.entity";
import { ResetToken } from "../entities/resetToken.entity";
import { Repository } from "typeorm";

describe("UserService", () => {
  let service: UsersService;
  let userRepository: Repository<User>;
  let resetTokensRepository: Repository<ResetToken>;
  const USER_REPOSITORY_TOKEN = getRepositoryToken(User);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(ResetToken),
          useValue: {
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(USER_REPOSITORY_TOKEN);
    resetTokensRepository = module.get<Repository<ResetToken>>(
      getRepositoryToken(ResetToken),
    );
  });

  it("user service should be defined", () => {
    expect(service).toBeDefined();
  });

  it("repository should be defined", () => {
    expect(userRepository).toBeDefined();
  });

  describe("create user", () => {
    it("should call user repository with correct data", async () => {
      await service.create({
        email: "email@email.com",
        password: "password",
      });
      expect(userRepository.save).toBeCalledWith({
        email: "email@email.com",
        password: "password",
        createdAt: expect.any(String),
      });
    });
  });

  describe("create Reset Token", () => {
    it("should call reset token repository with correct data", async () => {
      await service.createResetToken("email@email.com");

      expect(resetTokensRepository.save).toBeCalledWith({
        email: "email@email.com",
        token: expect.any(String),
        expire_timeStamp: expect.any(String),
        createdAt: expect.any(String),
      });
    });
  });
});
