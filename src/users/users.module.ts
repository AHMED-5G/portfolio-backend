import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { config } from 'dotenv';

config(); // Load environment variables from .env file

// Retrieve the secret key from the environment variable
const secret = process.env.JWT_SECRET;

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: 'secret',
      signOptions: {
        expiresIn: 3600,
      },
    }), 
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
