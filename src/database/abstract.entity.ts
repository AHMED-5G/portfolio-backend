import { Column, PrimaryGeneratedColumn } from "typeorm";

export class AbstractEntity<T> {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, default: Date.now().toString() })
  createdAt: string;

  constructor(entity: Partial<T>) {
    Object.assign(this, entity);
    this.createdAt = Date.now().toString();
  }
}
