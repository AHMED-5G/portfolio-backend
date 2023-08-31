import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../database/abstract.entity";

@Entity()
export class ResetToken extends AbstractEntity<ResetToken> {
  @Column()
  token: string;

  @Column()
  email: string;

  @Column()
  expire_timeStamp: string;

  @Column({ nullable: true })
  testMigrations: string;

  @Column({ nullable: true })
  datatime: string;
}
