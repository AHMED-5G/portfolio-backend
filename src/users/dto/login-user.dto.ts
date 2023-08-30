import { IsEmail } from "class-validator";
import { RequestLoginRequireData } from "shared-data/constants/requestsData";
export class LoginUserDto implements RequestLoginRequireData {
  @IsEmail()
  email: string;

  password: string;
}
