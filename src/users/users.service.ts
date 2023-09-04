import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./entities/user.entity";
import { FindOneOptions, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { validate } from "class-validator";
import { ResetToken } from "./entities/resetToken.entity";
import { hashPassword } from "../../src/utils";
import { ResetPasswordDto } from "./dto/reset-password-require-data.dto";

@Injectable()
export class UsersService {
  constructor(
    // private readonly entityManager: EntityManager,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(ResetToken)
    private readonly resetTokensRepository: Repository<ResetToken>,
  ) {}

  async resetPassword(body: ResetPasswordDto): Promise<User> {
    try {
      const resetTokenObject: ResetToken = await this.resetTokensRepository
        .createQueryBuilder("reset_token")
        .where({
          email: body.email,
        })
        .orderBy({ createdAt: "DESC" })
        .take(1)
        .getOne();

      if (!resetTokenObject) return null;

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

      if (!user) return null;

      const hashedPassword = hashPassword(body.newPassword);
      user.password = hashedPassword;

      const savedUser = await this.usersRepository.save(user);

      if (!savedUser) return null;
      return savedUser;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async createResetToken(email: string): Promise<ResetToken["token"]> {
    // Create a timestamp for 1 hour from now in Unix format
    const timeStampInUnix = (Date.now() + 60 * 60 * 1000).toString();

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
    return this.usersRepository.save(user);
  }

  getUserById(id: number): Promise<User> {
    return;
    return this.usersRepository.findOne({ where: { id } });
  }

  async findOne(userId: User["id"]): Promise<User> {
    const query: FindOneOptions<User> = { where: { id: userId } };
    return await this.usersRepository.findOne(query);
  }

  async findOneByEmail(email: string): Promise<User> {
    const query: FindOneOptions<User> = { where: { email } };
    return await this.usersRepository.findOne(query);
  }
}
