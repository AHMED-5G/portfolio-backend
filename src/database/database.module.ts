import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
//load config
config();

console.log('database.module.ts -> ', process.env.DB_PORT);
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const commonConfig = {
          host: configService.getOrThrow('DB_HOST'),
          port: configService.getOrThrow('DB_PORT'),
          database: configService.getOrThrow('DB_NAME'),
          username: configService.getOrThrow('DB_USERNAME'),
          password: configService.getOrThrow('DB_PASSWORD'),
          autoLoadEntities: true,
        };

        const mysqlConfig = {
          type: 'mysql' as const,
          ...commonConfig,
          synchronize: process.env.NODE_ENV === 'development',
        };

        const postgressConfig = {
          type: 'postgres' as const,
          // ...commonConfig,
          synchronize: false,
        };

        return process.env.DB_TYPE === 'mysql' ? mysqlConfig : postgressConfig;
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
