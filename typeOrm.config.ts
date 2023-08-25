import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/users/entities/user.entity';

// to make sure you have the env variables
config();

const configService = new ConfigService();

export default new DataSource({
  type: 'mysql',
  host: configService.getOrThrow('MYSQL_HOST'),
  port: configService.getOrThrow('MYSQL_PORT'),
  database: configService.getOrThrow('MYSQL_DATABASE'),
  username: configService.getOrThrow('MYSQL_USERNAME'),
  password: configService.getOrThrow('MYSQL_PASSWORD'),

  migrations: ['migrations/**'],
  entities: [User],
});
