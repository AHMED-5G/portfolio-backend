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
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(USER_REPOSITORY_TOKEN);
  });

  it("user service should be defined", () => {
    expect(service).toBeDefined();
  });

  it("repository should be defined", () => {
    expect(userRepository).toBeDefined();
  });

  describe("register", () => {
    it("should create a user", async () => {
      await service.create({
        email: "email@email.com",
        password: "password",
      });
    });
    it("should call user repository with correct data", async () => {
      await service.create({
        email: "email@email.com",
        password: "password",
      });
      expect(userRepository.save).toBeCalledWith({
        email: "email@email.com",
        password: "password",
      });
    });
  });

  //   describe("getUserById", () => {
  //     it("should create a user", async () => {
  //       await service.getUserById(1);
  //     });
  //   });
});
