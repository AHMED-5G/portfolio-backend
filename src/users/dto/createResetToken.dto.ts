import { IsEmail, IsNumber, IsString } from 'class-validator';

export class CreateResetTokenDto {
  @IsString()
  token: number;

  @IsEmail()
  email: string;

  @IsNumber()
  expire_timeStamp: number;
}
