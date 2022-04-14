import { DataSourceOptions } from 'typeorm';
import { Hentai } from '../entities/hentai.entity';
import { Message } from '../entities/message.entity';
import { Setu } from '../entities/setu.entity';
import { User } from '../entities/user.entity';

export default {
  synchronize: true,
  type: 'sqlite',
  database: process.env.TYPEORM_DATABASE,
  entities: [User, Message, Setu, Hentai],
  logging: false
} as DataSourceOptions;
