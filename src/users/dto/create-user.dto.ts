// src/users/dto/create-user.dto.ts

import { IsString, IsEmail, Length, IsOptional } from "class-validator";

export class CreateUserDto {
  // @IsString()
  // @Length(3, 30)
  // @IsOptional()
  // name: string;

  @IsString()
  @IsEmail()
  email: string;

  // @IsString()
  @Length(6, 20)
  password: string;

  // @IsString()
  // @Length(4, 20)
  // @IsOptional()
  // userName: string;
}
