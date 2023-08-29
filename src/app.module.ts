import { Module } from "@nestjs/common";
import { DatabaseModule } from "./database/database.module";
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from "./users/users.module";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { UserInterceptor } from "./users/interceptors/user.interceptor";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
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
