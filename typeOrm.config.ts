import { DataSource, DataSourceOptions } from "typeorm";
import { config } from "dotenv";
import { ConfigService } from "@nestjs/config";

// to make sure you have the env variables loaded
config();

const configService = new ConfigService();

const mysqlConfig: DataSourceOptions = {
  type: "mysql",
  host: configService.getOrThrow("SQL_DB_HOST"),
  port: configService.getOrThrow("SQL_DB_PORT"),
  database: configService.getOrThrow("SQL_DB_NAME"),
  username: configService.getOrThrow("SQL_DB_USERNAME"),
  password: configService.getOrThrow("SQL_DB_PASSWORD"),
  synchronize: true,
  migrations: ["dist/migrations/**"],
  entities: ["dist/**/*.entity.js"],
};

const postgressConfig: DataSourceOptions = {
  type: "postgres",
  host: configService.getOrThrow("DB_HOST"),
  port: configService.getOrThrow("DB_PORT"),
  database: configService.getOrThrow("DB_NAME"),
  username: configService.getOrThrow("DB_USERNAME"),
  password: configService.getOrThrow("DB_PASSWORD"),
  synchronize: false,
  // migrations: ["./migrations/**"],
  migrations: ["dist/migrations/**"],
  entities: ["dist/**/*.entity.js"],
};

console.log("typeOrm.config.ts -> ", process.env.NODE_ENV);
export const myDataSourceOptions: DataSourceOptions =
  process.env.NODE_ENV === "development" ? mysqlConfig : postgressConfig;

export default new DataSource(myDataSourceOptions);
