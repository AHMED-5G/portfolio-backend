// src/users/dto/create-user.dto.ts

import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEmail } from "class-validator";

export class CreateUserDto {
  @IsString()
  @IsEmail()
  @ApiProperty({ example: "email@example.com", required: true })
  email: string;

  // @IsString()
  // @Length(6, 20)
  @ApiProperty({ example: "123456", required: true })
  password: string;
}
