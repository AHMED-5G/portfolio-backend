//https://youtu.be/KkKiSN_yzdI?t=10414
import { Exclude } from "class-transformer";
import { MeSuccessObject } from "shared-data/constants/requestsData";
import { User } from "../entities/user.entity";

export class MeUserResponse implements User {
  name: string;

  id: number;

  email: string;

  userName: string;

  @Exclude()
  password: string;

  constructor(partial: Partial<MeSuccessObject>) {
    Object.assign(this, partial);
  }
}
