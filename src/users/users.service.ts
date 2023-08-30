import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./entities/user.entity";
import { EntityManager, Raw, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { validate } from "class-validator";
import { ResetToken } from "./entities/resetToken.entity";
import { ResetPasswordRequireData } from "shared-data/constants/requestsData";
import { hashPassword } from "../../src/utils";

@Injectable()
export class UsersService {
  constructor(
    private readonly entityManager: EntityManager,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(ResetToken)
    private readonly resetTokensRepository: Repository<ResetToken>,
  ) {}

  async resetPassword(body: ResetPasswordRequireData): Promise<User> {
    try {
      const resetTokenObject = await this.resetTokensRepository.findOne({
        where: {
          email: body.email,
          id: Raw((alias) => `${alias} = (SELECT MAX(id) FROM reset_token)`),
        },
      });

      const expirationTime = +resetTokenObject.expire_timeStamp;
      const currentTimestamp = Date.now();
      const oneHourInMilliseconds = 60 * 60 * 1000;

      if (
        resetTokenObject.token !== body.code ||
        expirationTime < currentTimestamp ||
        expirationTime > currentTimestamp + oneHourInMilliseconds
      ) {
        return null;
      }

      const user = await this.usersRepository.findOne({
        where: {
          email: body.email,
        },
      });
      user.password = hashPassword(body.newPassword);
      const savedUser = await this.usersRepository.save(user);

      if (savedUser) {
        return user;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  async createResetToken(email: string): Promise<ResetToken["token"]> {
    // Create a timestamp for 1 hour from now in Unix format
    const timeStampInUnix = Date.now() + 60 * 60 * 1000;

    // generate 5 digit token
    const token = Math.floor(10000 + Math.random() * 90000).toString();

    const resetToken = new ResetToken({
      email,
      expire_timeStamp: timeStampInUnix.toString(),
      token,
    });
    const savedResetToken = await this.resetTokensRepository.save(resetToken);

    if (savedResetToken) {
      return savedResetToken.token;
    }
  }

  async create(createUserDto: CreateUserDto) {
    const errors = await validate(createUserDto);
    if (errors.length > 0) {
      throw new Error("Validation failed");
    }
    const user = new User(createUserDto);
    await this.entityManager.save(user);
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: User["id"]) {
    return this.usersRepository.findOne({ where: { id } });
  }

  findOneByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({
      where: {
        email: email,
      },
    });
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
