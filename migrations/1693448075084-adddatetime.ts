import { MigrationInterface, QueryRunner } from "typeorm";

export class Adddatetime1693448075084 implements MigrationInterface {
    name = 'Adddatetime1693448075084'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reset_token" ADD "datatime" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reset_token" DROP COLUMN "datatime"`);
    }

}
