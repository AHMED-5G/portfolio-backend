import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { config } from "dotenv";

//load config
config();

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const commonConfig = {
          host: configService.getOrThrow("SQL_DB_HOST"),
          port: configService.getOrThrow("SQL_DB_PORT"),
          database: configService.getOrThrow("SQL_DB_NAME"),
          username: configService.getOrThrow("SQL_DB_USERNAME"),
          password: configService.getOrThrow("SQL_DB_PASSWORD"),
        };
        const mysqlConfig = {
          type: "mysql" as const,
          ...commonConfig,
          autoLoadEntities: true,
          synchronize: process.env.NODE_ENV === "development",
        };

        const postgressConfig = {
          type: "postgres" as const,
          // host: configService.getOrThrow("DB_HOST"),
          // port: configService.getOrThrow("DB_PORT"),
          // database: configService.getOrThrow("DB_NAME"),
          // username: configService.getOrThrow("DB_USERNAME"),
          password: configService.getOrThrow("DB_PASSWORD"),
          POSTGRES_PASSWORD: configService.getOrThrow("POSTGRES_PASSWORD"),
          synchronize: false,
        };

        return process.env.NODE_ENV === "development"
          ? mysqlConfig
          : postgressConfig;
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
