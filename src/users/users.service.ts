import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { validate } from 'class-validator';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly itemsRepository: Repository<User>,
    private readonly entityManager: EntityManager,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const errors = await validate(createUserDto);
    if (errors.length > 0) {
      throw new Error('Validation failed');
    }
    const user = new User(createUserDto);
    await this.entityManager.save(user);
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: User['id']) {
    return this.itemsRepository.findOne({ where: { id } });
  }

  findOneByEmail(email: string): Promise<User> {
    return this.itemsRepository.findOne({
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
