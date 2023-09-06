import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./entities/user.entity";
import { FindOneOptions, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ResetToken } from "./entities/resetToken.entity";

@Injectable()
export class UsersService {
  constructor(
    // private readonly entityManager: EntityManager,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(ResetToken)
    private readonly resetTokensRepository: Repository<ResetToken>,
  ) {}

  async findLastReestTokenByEmail(email: string): Promise<ResetToken> {
    return await this.resetTokensRepository
      .createQueryBuilder("reset_token")
      .where("reset_token.email = :email", { email: email })
      .orderBy("reset_token.createdAt", "DESC")
      .take(1)
      .getOne();
  }

  async updateUserData(user: User): Promise<User> {
    return await this.usersRepository.save(user);
  }

  async createResetToken(email: string): Promise<ResetToken["token"]> {
    // Create a timestamp for 1 hour from now in Unix format
    const timeStampInUnixAfterOneHour = (
      Date.now() +
      60 * 60 * 1000
    ).toString();

    // generate 5 digit token
    const token = Math.floor(10000 + Math.random() * 90000).toString();

    const resetToken = new ResetToken({
      email,
      expire_timeStamp: timeStampInUnixAfterOneHour.toString(),
      token,
    });
    const savedResetToken = await this.resetTokensRepository.save(resetToken);

    if (savedResetToken) {
      return savedResetToken.token;
    }
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new User(createUserDto);
    return await this.usersRepository.save(user);
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
