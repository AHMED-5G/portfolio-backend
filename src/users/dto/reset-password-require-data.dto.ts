// src/users/dto/create-user.dto.ts

import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEmail } from "class-validator";
import { ResetPasswordRequireData } from "shared-data/constants/requestsData";

export class ResetPasswordDto implements ResetPasswordRequireData {
  @ApiProperty()
  @IsString()
  code: string;

  @ApiProperty()
  newPassword: string;

  @IsEmail()
  @ApiProperty()
  @IsString()
  email: string;
}
