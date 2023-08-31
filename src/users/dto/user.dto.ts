//https://youtu.be/KkKiSN_yzdI?t=10414
import { Exclude } from "class-transformer";
import { MeSuccessObject } from "shared-data/constants/requestsData";
import { User } from "../entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";

export class MeUserResponse implements User {
  @ApiProperty()
  name: string;

  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  userName: string;

  @Exclude()
  password: string;

  constructor(partial: Partial<MeSuccessObject>) {
    Object.assign(this, partial);
  }
}
