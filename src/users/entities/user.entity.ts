import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../../database/abstract.entity';
import { IUser } from 'shared-data/types/models/user';

@Entity()
export class User extends AbstractEntity<IUser> implements IUser {
  @Column({ nullable: true })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  userName: string;
}
