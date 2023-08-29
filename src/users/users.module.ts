import { ClassSerializerInterceptor, Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { JwtModule } from "@nestjs/jwt";
import { config } from "dotenv";
import { ResetToken } from "./entities/resetToken.entity";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { jwtExpireTime } from "../constants/constants";

config(); // Load environment variables from .env file

// Retrieve the secret key from the environment variable
const secret = process.env.JWT_SECRET;

@Module({
  imports: [
    TypeOrmModule.forFeature([User, ResetToken]),
    JwtModule.register({
      secret,
      signOptions: {
        expiresIn: jwtExpireTime,
      },
    }),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class UsersModule {}
