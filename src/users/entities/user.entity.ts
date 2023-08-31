import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../database/abstract.entity";
import { IUser } from "shared-data/types";

//as we use AbstractEntity<User> so final instance will be inherit from User not IUser
@Entity()
export class User extends AbstractEntity<User> implements Required<IUser> {
  @Column({ nullable: true })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  userName: string;


}
