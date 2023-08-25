import {
  Controller,
  Get,
  Post,
  Body,
  // Patch,
  Param,
  Delete,
  BadRequestException,
  Res,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  @Post('register')
  async create(@Body() createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    createUserDto.password = hashedPassword;
    return this.usersService.create(createUserDto);
  }

  @Post('login')
  async login(
    @Body('email') email: User['email'],
    @Body('password') password: User['password'],
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new BadRequestException('invalid credentials');
    }
    if (!bcrypt.compareSync(password, user.password)) {
      throw new BadRequestException('invalid credentials');
    }

    const jwt = this.jwtService.signAsync({
      id: user.id,
    });

    response.cookie('jwt', jwt, {
      httpOnly: true,
    });

    return jwt;
  }

  @Get('me')
  async user(@Headers('authorization') authorization: string) {
    const jwt = authorization?.split(' ')[1];
    const data = await this.jwtService.verifyAsync(jwt);

    if (!data) throw new UnauthorizedException();

    const user = await this.usersService.findOne(data['id']);
    if (!user) throw new UnauthorizedException();

    delete user.password;
    return user;
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
