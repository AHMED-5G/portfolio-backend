import { MigrationInterface, QueryRunner } from "typeorm";

export class V1693447641002 implements MigrationInterface {
  name = "V1693447641002";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "name" character varying, "email" character varying NOT NULL, "password" character varying NOT NULL, "userName" character varying, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "reset_token" ("id" SERIAL NOT NULL, "token" character varying NOT NULL, "email" character varying NOT NULL, "expire_timeStamp" character varying NOT NULL, CONSTRAINT "PK_93e1171b4a87d2d0478295f1a99" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "reset_token"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
