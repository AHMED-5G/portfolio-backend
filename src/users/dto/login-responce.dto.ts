import { ApiProperty } from "@nestjs/swagger";
import { RequestLoginSuccessObject } from "shared-data/constants";

export class LoginResponseDto implements RequestLoginSuccessObject {
  @ApiProperty()
  jwt: string;
}
