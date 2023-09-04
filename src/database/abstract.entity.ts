import { Column, PrimaryGeneratedColumn } from "typeorm";

export class AbstractEntity<T> {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, default: (Date.now() + 60 * 60 * 1000).toString() })
  createdAt: string;

  constructor(entity: Partial<T>) {
    Object.assign(this, entity);
  }
}
