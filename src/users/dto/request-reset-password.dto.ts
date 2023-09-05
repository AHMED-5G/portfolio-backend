import { ApiProperty } from "@nestjs/swagger";
import { emailExample } from "../../../src/constants/constants";

export class RequestResetPasswordDto {
  @ApiProperty({ example: emailExample })
  email: string;
}
