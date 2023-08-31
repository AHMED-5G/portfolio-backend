import { MigrationInterface, QueryRunner } from "typeorm";

export class Addtestmigrationcol1693447920109 implements MigrationInterface {
  name = "Addtestmigrationcol1693447920109";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "reset_token" ADD "testMigrations" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "reset_token" DROP COLUMN "testMigrations"`,
    );
  }
}
