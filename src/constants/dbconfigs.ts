// import { DataSourceOptions } from "typeorm";
// import { config } from "dotenv";
// import { ConfigService } from "@nestjs/config";
// import { ResetToken } from "../../src/users/entities/resetToken.entity";
// import { User } from "../../src/users/entities/user.entity";

// // to make sure you have the env variables
// config();

// const configService = new ConfigService();

// const mysqlConfig: DataSourceOptions = {
//   type: "mysql",
//   host: configService.getOrThrow("SQL_DB_HOST").toString(),
//   port: configService.getOrThrow("SQL_DB_PORT").toString(),
//   database: configService.getOrThrow("SQL_DB_NAME").toString(),
//   username: configService.getOrThrow("SQL_DB_USERNAME").toString(),
//   password: configService.getOrThrow("SQL_DB_PASSWORD").toString(),
//   migrations: ["migrations/**"],
//   entities: [User, ResetToken],
// };

// const postgressConfig: DataSourceOptions = {
//   type: "postgres",
//   host: configService.getOrThrow("DB_HOST").toString(),
//   port: configService.getOrThrow("DB_PORT").toString(),
//   database: configService.getOrThrow("DB_NAME").toString(),
//   username: configService.getOrThrow("DB_USERNAME").toString(),
//   password: configService.getOrThrow("DB_PASSWORD").toString(),
//   migrations: ["migrations/**"],
//   entities: [User, ResetToken],
// };
// export const myDataSourceOptions: DataSourceOptions =
//   process.env.NODE_ENV === "development" ? mysqlConfig : postgressConfig;
