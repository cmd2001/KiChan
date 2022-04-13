import { DataSourceOptions } from 'typeorm';
import { User } from '../entities/user.entity';

export default {
  synchronize: true,
  type: 'sqlite',
  database: process.env.TYPEORM_DATABASE,
  entities: [User],
  logging: true
} as DataSourceOptions;
