import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";
import { RequestLoginRequireData } from "shared-data/constants/requestsData";
export class LoginUserDto implements RequestLoginRequireData {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  password: string;
}
