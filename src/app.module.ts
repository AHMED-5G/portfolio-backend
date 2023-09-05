import { Module } from "@nestjs/common";

import { ConfigModule } from "@nestjs/config";
import { UsersModule } from "./users/users.module";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { UserInterceptor } from "./users/interceptors/user.interceptor";
import { TypeOrmModule } from "@nestjs/typeorm";
import { myDataSourceOptions } from "../typeOrm.config.js";

console.log("database.module.ts  -> ", process.env.NODE_ENV);

@Module({
  // imports: [
  //   ConfigModule.forRoot({ isGlobal: true }),
  //   DatabaseModule,
  //   UsersModule,
  // ],
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(myDataSourceOptions),
    UsersModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: UserInterceptor,
    },
  ],
})
export class AppModule {}
