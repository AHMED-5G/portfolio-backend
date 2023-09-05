import { MigrationInterface, QueryRunner } from "typeorm";

export class Muser1693948418648 implements MigrationInterface {
  name = "Muser1693948418648";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "reset_token" ("id" SERIAL NOT NULL, "createdAt" character varying DEFAULT '1693952019184', "token" character varying NOT NULL, "email" character varying NOT NULL, "expire_timeStamp" character varying NOT NULL, CONSTRAINT "PK_93e1171b4a87d2d0478295f1a99" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "createdAt" character varying DEFAULT '1693952019184', "name" character varying, "email" character varying NOT NULL, "password" character varying NOT NULL, "userName" character varying, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "reset_token"`);
  }
}
